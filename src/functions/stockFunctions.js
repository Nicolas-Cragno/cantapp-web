import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function agregarItem(idDocumento, nombreColeccion, tipoCampo, valor) {
  if (valor === undefined || valor === null || valor === "") return; // daba error: Function arrayUnion() called with invalid data. 

  const ref = doc(db, nombreColeccion, idDocumento);
  const valores = Array.isArray(valor) ? valor : [valor];
  await updateDoc(ref, {
    [tipoCampo]: arrayUnion(...valores), // me tiraba error porque guardaba un array dentro de otro [[1, 2, 3]] por eso el arrayRemove
  });
}

export async function quitarItem(idDocumento, nombreColeccion, tipoCampo, valor) {
  if (valor === undefined || valor === null || valor === "") return; // daba error: Function arrayUnion() called with invalid data. 

  const ref = doc(db, nombreColeccion, idDocumento);
  const valores = Array.isArray(valor) ? valor : [valor];
  await updateDoc(ref, {
    [tipoCampo]: arrayRemove(...valores), // me tiraba error porque guardaba un array dentro de otro [[1, 2, 3]] por eso el arrayRemove 
  });
}

export async function reemplazarItems(idDocumento, nombreColeccion, tipoCampo, valor) {
  if (valor === undefined || valor === null || valor === "") return; // daba error: Function arrayUnion() called with invalid data. 

  const ref = doc(db, nombreColeccion, idDocumento);
  await setDoc(
    ref,
    {
      [tipoCampo]: Array.isArray(valor) ? valor : [valor], // me tiraba error porque guardaba un array dentro de otro [[1, 2, 3]] por eso el arrayRemove
    },
    { merge: true }
  );
}

export async function actualizarFaltante(idVehiculo, coleccion, idFaltante, nuevaCantidad) {
  const ref = doc(db, String(coleccion), String(idVehiculo));
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const faltantes = data.faltantes || [];

  const existe = faltantes.some(f => f.idFaltante === idFaltante);

  let actualizado;

  if (existe) {
    actualizado = faltantes.map(f =>
      f.idFaltante === idFaltante
        ? { ...f, cantidad: nuevaCantidad }
        : f
    );
  } else {
    actualizado = [
      ...faltantes,
      {
        idFaltante,
        cantidad: nuevaCantidad,
      }
    ];
  }

  await updateDoc(ref, { faltantes: actualizado });
}

export async function actualizarHerramientas(idDocumento, nombreColeccion, tipoCampo, herramientas = []) {
  if (!idDocumento || !nombreColeccion || !tipoCampo) {
    console.error("[Error] Faltan parámetros para actualizarHerramientas:", {
      idDocumento,
      nombreColeccion,
      tipoCampo,
    });
    return;
  }

  const limpiarDatos = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(limpiarDatos);
    } else if (obj && typeof obj === "object") {
      const limpio = {};
      for (const [key, value] of Object.entries(obj)) {
        limpio[key] = value === undefined ? null : limpiarDatos(value);
      }
      return limpio;
    }
    return obj === undefined ? null : obj;
  };

  const herramientasLimpias = limpiarDatos(herramientas);

  try {
    const ref = doc(db, nombreColeccion, idDocumento);

    await setDoc(
      ref,
      { [tipoCampo]: herramientasLimpias },
      { merge: true }
    );

    console.log(`~ ${tipoCampo} actualizado correctamente en ${nombreColeccion}/${idDocumento} ✓️`);
  } catch (error) {
    console.error("[Error] al actualizar herramientas:", error);
    throw error;
  }
}

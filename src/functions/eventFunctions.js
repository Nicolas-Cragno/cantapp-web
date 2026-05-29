import { db } from "../firebase/firebaseConfig";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  Timestamp,
  updateDoc,
  arrayUnion,
  getDoc
} from "firebase/firestore";
import codigosArea from "./data/areas.json";
import { useData } from "../context/DataContext";

function limpiarUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map(limpiarUndefined);
  } else if (obj && typeof obj === "object") {
    const limpio = {};
    for (const [k, v] of Object.entries(obj)) {
      limpio[k] = v === undefined ? null : limpiarUndefined(v);
    }
    return limpio;
  }
  return obj;
}

export const agregarEvento = async (evento, area, idExistente = null, asignacion = false) => {
  const usuarioJson = JSON.parse(localStorage.getItem("usuario"));
  let usuarioCarga = usuarioJson.apellido + ", " + usuarioJson.nombres;

  try {
    if (!codigosArea[area]) {
      throw new Error(`Área no válida: ${area}`);
    }
    const codigoArea = codigosArea[area];


    const fecha = new Date();

    // calcular ID
    let idEvento = idExistente;
    let nroOrden = null;
    let coleccion = "eventos";

    if (asignacion) {

      const resultado = await generarCodigoAsignacion();

      idEvento = resultado.id;
      nroOrden = resultado.orden;

      coleccion = "asignaciones";
    } else {
      if (!idEvento) {
        const q = query(collection(db, "eventos"), where("area", "==", area));
        const snapshot = await getDocs(q);

        let maxCorrelativo = 0;
        snapshot.forEach((docSnap) => {
          const partes = docSnap.id.split("-");
          if (partes.length === 2 && partes[0] === codigoArea) {
            const nro = parseInt(partes[1], 10);
            if (!isNaN(nro) && nro > maxCorrelativo) {
              maxCorrelativo = nro;
            }
          }
        });

        const nuevoCorrelativo = maxCorrelativo + 1;
        nroOrden = nuevoCorrelativo;
        const correlativoStr = String(nuevoCorrelativo).padStart(8, "0");
        idEvento = `${codigoArea}-${correlativoStr}`;
      }

    }

    const docRef = doc(db, coleccion, idEvento);

    if (!idExistente) {
      // 👉 Evento nuevo
      const dataAGuardar = limpiarUndefined({
        ...evento,
        area,
        orden: nroOrden,
        fecha: Timestamp.fromDate(fecha),
        usuario: usuarioCarga,
        modificaciones: [],    // historial vacío
      });

      await setDoc(docRef, { ...dataAGuardar, "orden": nroOrden });
    } else {
      // actualizacionn
      let dataAGuardar = limpiarUndefined({
        ...evento,
        area,
      });

      delete dataAGuardar.fecha;
      delete dataAGuardar.usuario;

      await updateDoc(docRef, {
        ...dataAGuardar,
        modificaciones: arrayUnion({
          usuario: usuarioCarga,
          fecha: Timestamp.fromDate(new Date()),
        }),
      });
    }

    // actualizar cache
    const cache = localStorage.getItem("eventos");
    const cacheActual = cache ? JSON.parse(cache) : [];

    const indiceExistente = cacheActual.findIndex((item) => item.id === idEvento);
    if (indiceExistente >= 0) {
      // actualizar
      cacheActual[indiceExistente] = {
        ...cacheActual[indiceExistente],
        ...evento,
        area,
        modificaciones: [
          ...(cacheActual[indiceExistente].modificaciones || []),
          { usuario: usuarioCarga, fecha: new Date().toISOString() },
        ],
      };
    } else {
      // agregar nuevo
      cacheActual.push({
        id: idEvento,
        ...evento,
        area,
        usuario: usuarioCarga,
        modificaciones: [],
      });
    }

    localStorage.setItem("eventos", JSON.stringify(cacheActual));

    return { id: idEvento, ...evento, area };
  } catch (error) {
    console.error("Error al agregar evento:", error);
    throw error;
  }
};


const generarCodigoAsignacion = async () => {

  const contadorRef = doc(
    db,
    "contadores",
    "asignaciones"
  );

  const contadorSnap = await getDoc(
    contadorRef
  );

  if (!contadorSnap.exists()) {
    throw new Error(
      "No existe el contador de asignaciones"
    );
  }

  const data = contadorSnap.data();

  const ultimo =
    Number(data.ultimo || 0);

  const nuevoOrden =
    ultimo + 1;
  await updateDoc(
    contadorRef,
    {
      ultimo: nuevoOrden,
    }
  );

  return {
    id: `AS${String(nuevoOrden).padStart(8, "0")}`,
    orden: nuevoOrden,
  };
};
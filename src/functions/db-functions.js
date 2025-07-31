import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { obtenerCuitPorNombre } from "./data-functions";

// Limpiar cache

export const limpiarCache = (...claves) => {
  if (claves.length === 0) {
    localStorage.clear(); // Elimina todo el localStorage
  } else {
    claves.forEach(clave => localStorage.removeItem(clave));
  }
};

// Listar dnis (si hay cache y no hay modificaciones se lista desde ahi) 5 minutos y se recarga
export const listarColeccion = async (nombreColeccion, usarCache = true, tiempoCacheMs = 5 * 60 * 1000) => {
  const cacheKey = `${nombreColeccion}_cache`;
  const timestampKey = `${nombreColeccion}_timestamp`;
  const ahora = Date.now();

  if (usarCache) {
    const cache = localStorage.getItem(cacheKey);
    const timestamp = localStorage.getItem(timestampKey);

    if (cache && timestamp && (ahora - Number(timestamp)) < tiempoCacheMs) {
      return JSON.parse(cache);
    }
  }

  try {
    const querySnapshot = await getDocs(collection(db, nombreColeccion));
    const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const datosOrdenados = [...datos].sort((a, b) => {
      const fechaA = a.fecha?.toDate?.() || new Date(a.fecha) || new Date(0);
      const fechaB = b.fecha?.toDate?.() || new Date(b.fecha) || new Date(0);
      return fechaA - fechaB;
    });

    localStorage.setItem(cacheKey, JSON.stringify(datosOrdenados));
    localStorage.setItem(timestampKey, ahora.toString());

    return datosOrdenados;

  } catch (error) {
    console.error(`Error al obtener ${nombreColeccion}:`, error);
    return [];
  }
};

export const listarPorEmpresa = async (nombreColeccion, empresa, usarCache = true) => {
  let cuit = Number(obtenerCuitPorNombre(empresa));
  const datos = await listarColeccion(nombreColeccion, usarCache);
  const datosFiltrados = datos.filter(item => item.empresa === cuit);
  return datosFiltrados;
};

// Agregar dni y actualizar cache
export const agregar = async (nombreColeccion, nuevoDoc, idPersonalizado) => {
  try {
    const idStr = String(idPersonalizado); // <-- Convertir a string
    const docRef = doc(db, nombreColeccion, idStr);
    await setDoc(docRef, nuevoDoc);

    const cache = localStorage.getItem(nombreColeccion);
    const cacheActual = cache ? JSON.parse(cache) : [];

    const nuevoDocConId = { id: idStr, ...nuevoDoc };
    const datosActualizados = [...cacheActual, nuevoDocConId];

    localStorage.setItem(nombreColeccion, JSON.stringify(datosActualizados));

    return nuevoDocConId;
  } catch (error) {
    console.error(`Error al agregar dni en ${nombreColeccion}:`, error);
    throw error;
  }
};

export const agregarEvento = async (nuevoEvento, idPersonalizado = null) => {
  try {
    let docRef;

    if (idPersonalizado) {
      const idStr = String(idPersonalizado);
      docRef = doc(db, "eventos", idStr);
      await setDoc(docRef, nuevoEvento);
    } else {
      const colRef = collection(db, "eventos");
      docRef = await addDoc(colRef, nuevoEvento);
    }

    const cache = localStorage.getItem("eventos");
    const cacheActual = cache ? JSON.parse(cache) : [];

    const idReal = docRef.id;

    const indiceExistente = cacheActual.findIndex((item) => item.id === idReal);
    if (indiceExistente >= 0) {
      cacheActual[indiceExistente] = { id: idReal, ...nuevoEvento };
    } else {
      cacheActual.push({ id: idReal, ...nuevoEvento });
    }

    localStorage.setItem("eventos", JSON.stringify(cacheActual));

    return { id: idReal, ...nuevoEvento };
  } catch (error) {
    console.error("Error al agregar o modificar evento:", error);
    throw error;
  }
};

// Modificar dni y cache
export const modificar = async (nombreColeccion, idDoc, datosActualizados) => {
  try {
    const idStr = String(idDoc);
    const docRef = doc(db, nombreColeccion, idStr);
    await updateDoc(docRef, datosActualizados);

    const cache = localStorage.getItem(nombreColeccion);
    const lista = cache ? JSON.parse(cache) : [];

    const nuevaLista = lista.map(item =>
      item.id === idStr ? { ...item, ...datosActualizados } : item
    );

    localStorage.setItem(nombreColeccion, JSON.stringify(nuevaLista));

    return true;
  } catch (error) {
    console.error(`Error al modificar dni en ${nombreColeccion}:`, error);
    throw error;
  }
};

// Eliminar dni y actualizar cache
export const eliminarDni = async (nombreColeccion, idDoc) => {
  try {
    const idStr = String(idDoc);
    const docRef = doc(db, nombreColeccion, idStr);
    await deleteDoc(docRef);

    const cache = localStorage.getItem(nombreColeccion);
    const lista = cache ? JSON.parse(cache) : [];

    const nuevaLista = lista.filter(item => item.id !== idStr);

    localStorage.setItem(nombreColeccion, JSON.stringify(nuevaLista));

    return true;
  } catch (error) {
    console.error(`Error al eliminar dni en ${nombreColeccion}:`, error);
    throw error;
  }
};

// Evitar duplicar dni en firestore
export const verificarDni = async (dni) => {
  try {
    const dniStr = String(dni);
    const q = query(collection(db, "personas"), where("dni", "==", dniStr));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error verificando dni:", error);
    return false;
  }
};

// (los demás métodos se mantienen igual)


// buscar interno, patente, nombre...
export const verificarDominio = async (dominio, coleccion) => {
  const q = query(collection(db, coleccion), where("dominio", "==", dominio));
  const snapshot = await getDocs(q);
  return !snapshot.empty; // devuelve true o false
}

export const verificarInterno = async (interno, nombreColeccion) => {
  try {
    const q = query(
      collection(db, nombreColeccion),
      where("interno", "==", interno)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  } catch (error) {
    console.error(`Error verificando interno en ${nombreColeccion}:`, error);
    return false; 
  }
};

export const buscarNombrePorDni = async (dni) => {
  try {
    const personas = await listarColeccion("personas", true);
    const persona = personas.find(p => p.dni === dni);

    if (!persona) {
      console.warn(`No se encontró registro del DNI ${dni}`);
      return "Desconocido";
    }

    return `${persona.apellido} ${persona.nombres}`;
  } catch (error) {
    console.error("Error en la búsqueda: ", error);
    return "Error";
  }
};

export const buscarNombreUsuario = async (uid) => {
  try{
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      return docSnap.data().nombres || "Sin nombre";
    } else {
      console.warn("No existe el usuario con uid: ", uid);
      return "Usuario no encontrado";
    }
  } catch(error){
    console.error("Error al obtener nombre de usuario:", error);
    return "Error";
  }
};

// stock

export const buscarRepuestoPorID = async (id) => {
  try{
    const repuestos = await listarColeccion("stock", true);
  const repuesto = repuestos.find(r => r.id === id);

  if(!repuesto){
    console.warn("No se encontro repuesto con ese codigo.");
    return "NO REGISTRADO";
  }

  return `${repuesto.descripcion} (${repuesto.marca})`;
  } catch(error){
    console.error("Error en la búsqueda: ", error);
    return "Error";
  }
}

export const codigoStock = async (tipo, prefijo) => {
  const articulos = await listarColeccion("stock", true);

  const articulosTipo = articulos.filter(
    (a) => a.tipo?.toLowerCase() === tipo.toLowerCase()
  );

  const maxNum = articulosTipo.reduce((max, art) => {
    const match = art.id?.match(/\d+$/);
    const numero = match ? parseInt(match[0], 10) : 0;
    return numero > max ? numero : max;
  }, 0);

  const nuevoNumero = maxNum + 1;
  return `${prefijo}${String(nuevoNumero).padStart(4, "0")}`;
};

export const sumarCantidadStock = async (idArticulo, cantidadASumar) => {
  try {
    const ref = doc(db, "stock", idArticulo);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Artículo no encontrado");
    }

    const data = snap.data();
    const nuevaCantidad = (data.cantidad || 0) + cantidadASumar;

    await updateDoc(ref, { cantidad: nuevaCantidad });

    return nuevaCantidad;
  } catch (error) {
    console.error("Error al sumar cantidad al stock:", error);
    throw error;
  }
};

export const sumarMultiplesCantidades = async (ingresosMap) => {
  try {
    for (const [idArticulo, cantidadASumar] of Object.entries(ingresosMap)) {
      const ref = doc(db, "stock", idArticulo);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        console.warn(`Artículo con ID ${idArticulo} no encontrado`);
        continue; // o lanzar error si preferís
      }

      const data = snap.data();
      const nuevaCantidad = (data.cantidad || 0) + cantidadASumar;

      await updateDoc(ref, { cantidad: nuevaCantidad });
    }
  } catch (error) {
    console.error("Error al actualizar múltiples cantidades:", error);
    throw error;
  }
};

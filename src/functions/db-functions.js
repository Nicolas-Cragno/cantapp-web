import { collection, doc, getDocs, updateDoc, deleteDoc, query, where, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { obtenerCuitPorNombre } from "./data-functions";

// Listar dnis (si hay cache y no hay modificaciones se lista desde ahi)
export const listarColeccion = async (nombreColeccion, usarCache = true) => {
  if (usarCache) {
    const cache = localStorage.getItem(nombreColeccion);
    if (cache) return JSON.parse(cache);
  }

  try {
    const querySnapshot = await getDocs(collection(db, nombreColeccion));
    const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const datosOrdenados = [...datos].sort((a, b) => {
      const fechaA = a.fecha ? a.fecha.toDate() : new Date(0); // si no hay fecha, fecha mínima
      const fechaB = b.fecha ? b.fecha.toDate() : new Date(0);
      return fechaB - fechaA; // descendente: más reciente primero
    });

    localStorage.setItem(nombreColeccion, JSON.stringify(datosOrdenados));
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
}

// Agregar dni y actualizar cache
export const agregar = async (nombreColeccion, nuevoDoc, idPersonalizado) => {
  try {
    const docRef = doc(db, nombreColeccion, idPersonalizado); 
    await setDoc(docRef, nuevoDoc);

    const cache = localStorage.getItem(nombreColeccion);
    const cacheActual = cache ? JSON.parse(cache) : [];

    const nuevoDocConId = { id: idPersonalizado, ...nuevoDoc };
    const datosActualizados = [...cacheActual, nuevoDocConId];

    localStorage.setItem(nombreColeccion, JSON.stringify(datosActualizados));

    return nuevoDocConId;
  } catch (error) {
    console.error(`Error al agregar dni en ${nombreColeccion}:`, error);
    throw error;
  }
};

// Modificar dni y cache
export const modificar = async (nombreColeccion, idDoc, datosActualizados) => {
  try {
    const docRef = doc(db, nombreColeccion, idDoc);
    await updateDoc(docRef, datosActualizados);

    const cache = localStorage.getItem(nombreColeccion);
    const lista = cache ? JSON.parse(cache) : [];

    const nuevaLista = lista.map(item =>
      item.id === idDoc ? { ...item, ...datosActualizados } : item
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
    const docRef = doc(db, nombreColeccion, idDoc);
    await deleteDoc(docRef);

    const cache = localStorage.getItem(nombreColeccion);
    const lista = cache ? JSON.parse(cache) : [];

    const nuevaLista = lista.filter(item => item.id !== idDoc);

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
    const q = query(collection(db, "personas"), where("dni", "==", dni));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error verificando dni:", error);
    return false;
  }
};

// Evitar duplicar patente / interno
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

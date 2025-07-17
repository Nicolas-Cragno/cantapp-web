import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Listar documentos (si hay cache y no hay modificaciones se lista desde ahi)
export const listarColeccion = async (nombreColeccion, usarCache = true) => {
  if (usarCache) {
    const cache = localStorage.getItem(nombreColeccion);
    if (cache) return JSON.parse(cache);
  }

  try {
    const querySnapshot = await getDocs(collection(db, nombreColeccion));
    const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    localStorage.setItem(nombreColeccion, JSON.stringify(datos));
    return datos;
  } catch (error) {
    console.error(`Error al obtener ${nombreColeccion}:`, error);
    return [];
  }
};

// Agregar documento y actualizar cache
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
    console.error(`Error al agregar documento en ${nombreColeccion}:`, error);
    throw error;
  }
};

// Modificar documento y cache
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
    console.error(`Error al modificar documento en ${nombreColeccion}:`, error);
    throw error;
  }
};

// Eliminar documento y actualizar cache
export const eliminarDocumento = async (nombreColeccion, idDoc) => {
  try {
    const docRef = doc(db, nombreColeccion, idDoc);
    await deleteDoc(docRef);

    const cache = localStorage.getItem(nombreColeccion);
    const lista = cache ? JSON.parse(cache) : [];

    const nuevaLista = lista.filter(item => item.id !== idDoc);

    localStorage.setItem(nombreColeccion, JSON.stringify(nuevaLista));

    return true;
  } catch (error) {
    console.error(`Error al eliminar documento en ${nombreColeccion}:`, error);
    throw error;
  }
};

// Evitar duplicar documento en firestore
export const verificarDni = async (documento) => {
  try {
    const q = query(collection(db, "personas"), where("documento", "==", documento));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error verificando documento:", error);
    return false;
  }
};

// Evitar duplicar patente
export const verificarDominio = async (dominio, coleccion) => {
  const q = query(collection(db, coleccion), where("dominio", "==", dominio));
  const snapshot = await getDocs(q);
  return !snapshot.empty; // devuelve true o false
}


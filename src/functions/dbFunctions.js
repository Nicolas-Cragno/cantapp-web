import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore";

// Agregar documento
export const agregar = async (nombreColeccion, nuevoDoc, idPersonalizado) => {
  try {
    let docRef;
    let idStr;

    if (idPersonalizado) {
      idStr = String(idPersonalizado);
      docRef = doc(db, nombreColeccion, idStr);
      await setDoc(docRef, nuevoDoc);
    } else {
      docRef = await addDoc(collection(db, nombreColeccion), nuevoDoc);
      idStr = docRef.id;
    }

    return { id: idStr, ...nuevoDoc };
  } catch (error) {
    console.error(`Error al agregar documento en ${nombreColeccion}:`, error);
    throw error;
  }
};
// Modificar documento
export const modificar = async (nombreColeccion, idDoc, datosActualizados) => {
  try {
    const idStr = String(idDoc);
    const docRef = doc(db, nombreColeccion, idStr);
    await updateDoc(docRef, datosActualizados);
    return true;
  } catch (error) {
    console.error(`Error al modificar documento en ${nombreColeccion}:`, error);
    throw error;
  }
};
// alta baja de empleado
export const altaBaja = async (nombreColeccion, idDoc, empresa=null, tipo=true) => {
   if (!idDoc || typeof idDoc !== "string") {
    throw new Error("ID de documento inválido: " + idDoc);
  }
  try{
      const idStr = String(idDoc);
    await modificar(nombreColeccion, idStr, { estado: tipo, empresa});
    return true;
  } catch(error){
    console.error(
      `Error al cambiar estado en ${nombreColeccion}, id ${idDoc}:`,
      error
    );
    throw error;
  }
};
// alta baja satelital
export const cambiarEstadoSatelital = async (nombreColeccion, idDoc, idSatelital = null, boolEstado =true) => {
  if(!idDoc || typeof idDoc !== "string") {
    throw new Error("[Error] No se pudo cambiar el estado del satelital." + idDoc);
  }
  try{
    const idStr = String(idDoc);
    await modificar(nombreColeccion, idStr, {satelital: idSatelital, estadoSatelital: boolEstado});
    return true;
  } catch(error){
    console.error(
      `[Error] no se pudo cambiar el estado del satelital del interno ${idDoc}.`,
      error
    );
    throw error;
  }
};

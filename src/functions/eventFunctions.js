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
} from "firebase/firestore";
import codigosArea from "./data/areas.json";

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

export const agregarEvento = async (evento, area, idExistente = null) => {
  const usuarioJson = JSON.parse(localStorage.getItem("usuario"));
  let usuarioCarga = usuarioJson.apellido + ", " + usuarioJson.nombres;

  try {
    if (!codigosArea[area]) {
      throw new Error(`Área no válida: ${area}`);
    }
    const codigoArea = codigosArea[area];

    
    let fecha = evento.fecha;
    if (fecha) {
      if (fecha.toDate) {
        fecha = fecha.toDate();
      } else if (typeof fecha === "string") {
        fecha = new Date(fecha);
      }
      if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        console.warn("⚠ Fecha inválida detectada, usando fecha actual:", evento.fecha);
        fecha = new Date();
      }
    } else {
      fecha = new Date();
    }

  
    let idEvento = idExistente;
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
      const correlativoStr = String(nuevoCorrelativo).padStart(8, "0");
      idEvento = `${codigoArea}-${correlativoStr}`;
    }

    const docRef = doc(db, "eventos", idEvento);

    if (!idExistente) {
      // 👉 Evento nuevo
      const dataAGuardar = limpiarUndefined({
        ...evento,
        area,
        fecha: Timestamp.fromDate(fecha),
        usuario: usuarioCarga, 
        modificaciones: [],    // historial vacío
      });

      await setDoc(docRef, dataAGuardar);
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

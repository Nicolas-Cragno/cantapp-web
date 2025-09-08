import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDocs, collection, query, where, Timestamp } from "firebase/firestore";
import codigosArea from "./data/areas.json";

export const agregarEvento = async (evento, area, idExistente = null) => {
  const usuarioJson = JSON.parse(localStorage.getItem("usuario"));
  const usuarioCarga = usuarioJson.apellido + ", " + usuarioJson.nombres;

  try {
    if (!codigosArea[area]) {
      throw new Error(`Área no válida: ${area}`);
    }
    const codigoArea = codigosArea[area];

    // --- Normalizar fecha ---
    let fecha = evento.fecha;
    if (fecha) {
      if (fecha.toDate) {
        // Firestore Timestamp
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

    // Si no hay ID existente, generar uno nuevo
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

    let dataAGuardar = {
      ...evento,
      area,
      usuario: usuarioCarga,
    };

    if (idExistente) {
      // Si es modificación, no sobrescribo la fecha
      delete dataAGuardar.fecha;
    }
    await setDoc(docRef, { ...evento, area, usuario: usuarioCarga });

    // Actualizar cache local
    const cache = localStorage.getItem("eventos");
    const cacheActual = cache ? JSON.parse(cache) : [];

    const indiceExistente = cacheActual.findIndex((item) => item.id === idEvento);
    if (indiceExistente >= 0) {
      cacheActual[indiceExistente] = { id: idEvento, ...evento, area };
    } else {
      cacheActual.push({ id: idEvento, ...evento, area });
    }

    localStorage.setItem("eventos", JSON.stringify(cacheActual));

    return { id: idEvento, ...evento, area };
  } catch (error) {
    console.error("Error al agregar evento:", error);
    throw error;
  }
};

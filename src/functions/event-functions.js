import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import codigosArea from "./data/areas.json";

export const agregarEvento = async (nuevoEvento, area) => {
  const usuarioJson = JSON.parse(localStorage.getItem("usuario"));
  const usuarioCarga = usuarioJson.apellido + ", " + usuarioJson.nombres;
  try {
    if (!codigosArea[area]) {
      throw new Error(`Área no válida: ${area}`);
    }
    const codigoArea = codigosArea[area];

    const q = query(
      collection(db, "eventos"),
      where("area", "==", area)
    );
    const snapshot = await getDocs(q);

    let maxCorrelativo = 0;
    snapshot.forEach((docSnap) => {
      const idDoc = docSnap.id;
      const partes = idDoc.split("-");
      if (partes.length === 2 && partes[0] === codigoArea) {
        const nro = parseInt(partes[1], 10);
        if (!isNaN(nro) && nro > maxCorrelativo) {
          maxCorrelativo = nro;
        }
      }
    });

    const nuevoCorrelativo = maxCorrelativo + 1;
    const correlativoStr = String(nuevoCorrelativo).padStart(8, "0");
    const idEvento = `${codigoArea}-${correlativoStr}`;

    const docRef = doc(db, "eventos", idEvento);
    await setDoc(docRef, { ...nuevoEvento, area, usuario: usuarioCarga });

    const cache = localStorage.getItem("eventos");
    const cacheActual = cache ? JSON.parse(cache) : [];

    const indiceExistente = cacheActual.findIndex((item) => item.id === idEvento);
    if (indiceExistente >= 0) {
      cacheActual[indiceExistente] = { id: idEvento, ...nuevoEvento, area };
    } else {
      cacheActual.push({ id: idEvento, ...nuevoEvento, area });
    }

    localStorage.setItem("eventos", JSON.stringify(cacheActual));

    return { id: idEvento, ...nuevoEvento, area };
  } catch (error) {
    console.error("Error al agregar evento:", error);
    throw error;
  }
};

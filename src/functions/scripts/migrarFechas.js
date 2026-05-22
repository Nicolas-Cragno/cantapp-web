import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";

const migrarFechasEventos = async () => {
  try {
    const ref = collection(db, "eventos");

    const snapshot = await getDocs(ref);

    let actualizados = 0;
    let omitidos = 0;
    let errores = 0;

    for (const documento of snapshot.docs) {
      try {
        const data = documento.data();

        if (!data.fecha) {
          omitidos++;
          continue;
        }

        // Ya es Timestamp válido
        if (
          typeof data.fecha === "object" &&
          data.fecha.seconds !== undefined &&
          data.fecha.nanoseconds !== undefined
        ) {
          omitidos++;
          continue;
        }

        let nuevaFecha = null;

        // Date JS
        if (data.fecha instanceof Date) {
          nuevaFecha = Timestamp.fromDate(data.fecha);
        }

        // String
        else if (typeof data.fecha === "string") {
          const fechaParseada = new Date(data.fecha);

          if (!isNaN(fechaParseada.getTime())) {
            nuevaFecha = Timestamp.fromDate(fechaParseada);
          }
        }

        // Objeto serializado
        else if (
          typeof data.fecha === "object" &&
          data.fecha._seconds !== undefined
        ) {
          nuevaFecha = new Timestamp(
            data.fecha._seconds,
            data.fecha._nanoseconds || 0
          );
        }

        // Timestamp como Map
        else if (
          typeof data.fecha === "object" &&
          data.fecha.seconds !== undefined
        ) {
          nuevaFecha = new Timestamp(
            data.fecha.seconds,
            data.fecha.nanoseconds || 0
          );
        }

        if (!nuevaFecha) {
          console.error(
            `[ERROR] Fecha inválida en ${documento.id}`,
            data.fecha
          );

          errores++;
          continue;
        }

        await updateDoc(
          doc(db, "eventos", documento.id),
          {
            fecha: nuevaFecha,
          }
        );

        actualizados++;

        console.log(
          `[OK] ${documento.id} actualizado`
        );
      } catch (err) {
        errores++;

        console.error(
          `[ERROR] Documento ${documento.id}`,
          err
        );
      }
    }

    console.log("------------------------------------------------");
    console.log("Migración finalizada");
    console.log("Actualizados:", actualizados);
    console.log("Omitidos:", omitidos);
    console.log("Errores:", errores);

    process.exit(0);
  } catch (error) {
    console.error("Error general:", error);

    process.exit(1);
  }
};

migrarFechasEventos();
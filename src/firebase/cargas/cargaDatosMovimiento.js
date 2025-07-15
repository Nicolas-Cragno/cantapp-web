const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("../clave-firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const { Timestamp } = admin.firestore;

const data = JSON.parse(fs.readFileSync(__dirname + "/datos/cargaMovimiento.json", "utf-8"));

function normalizarEvento(evento) {
    const eventoNormalizado = {};

    // Strings (obligatorios)
    eventoNormalizado.tipo = String(evento.tipo || "");
    eventoNormalizado.subtipo = String(evento.subtipo || "");
    eventoNormalizado.detalle = String(evento.detalle || "");

    // Números (convertir o 0 si no viene)
    eventoNormalizado.persona = Number(evento.persona) || 0;
    eventoNormalizado.tractor = Number(evento.tractor) || 0;
    eventoNormalizado.furgon = Number(evento.furgon) || 0;

    // Fecha - convertir a Timestamp, si no viene asignar fecha actual
    if (typeof evento.fecha === "string") {
        const fechaDate = new Date(evento.fecha);
        if (!isNaN(fechaDate.getTime())) {
            eventoNormalizado.fecha = Timestamp.fromDate(fechaDate);
        } else {
            eventoNormalizado.fecha = Timestamp.now();
        }
    } else if (evento.fecha && typeof evento.fecha.toDate === "function") {
        eventoNormalizado.fecha = evento.fecha;
    } else {
        eventoNormalizado.fecha = Timestamp.now();
    }

    // Booleanos con valor por defecto false si no viene o es inválido
    const booleanFields = [
        "corte",
        "panico",
        "reporte",
        "desenganche",
        "cabina",
        "true",
        "antibandalico",
        "puertafurgon",
        "llave"
    ];

    booleanFields.forEach(field => {
        const val = evento[field];
        if (typeof val === "boolean") {
            eventoNormalizado[field] = val;
        } else if (typeof val === "string") {
            eventoNormalizado[field] = val.toLowerCase() === "true";
        } else {
            eventoNormalizado[field] = false;
        }
    });

    return eventoNormalizado;
}

async function cargarEventos() {
    try {
        const ultimoSnapshot = await db.collection("eventos")
            .orderBy("id", "desc")
            .limit(1)
            .get();

        let ultimoEvento = 0;
        if (!ultimoSnapshot.empty) {
            const ultimoDoc = ultimoSnapshot.docs[0];
            ultimoEvento = parseInt(ultimoDoc.data().id, 10);
        }

        for (const evento of data) {
            ultimoEvento++;
            const eventoNormalizado = normalizarEvento(evento);
            eventoNormalizado.id = ultimoEvento;

            await db.collection("eventos").doc(ultimoEvento.toString()).set(eventoNormalizado);
            console.log(`Evento agregado: ${ultimoEvento}`);
        }
    } catch (error) {
        console.error("Error durante la carga: ", error);
    }
}

cargarEventos();

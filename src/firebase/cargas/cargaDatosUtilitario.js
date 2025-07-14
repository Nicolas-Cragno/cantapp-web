const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("../clave-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const data = JSON.parse(fs.readFileSync(__dirname + "/datos/cargaUtilitario.json", "utf-8"));

async function cargarUtilitarios() {
  try {
    // Paso 1: Obtener el último 'interno' usado ordenando descendente y limitando a 1
    const ultimoSnapshot = await db.collection("utilitarios")
      .orderBy("interno", "desc")
      .limit(1)
      .get();

    let ultimoInterno = 0;
    if (!ultimoSnapshot.empty) {
      const ultimoDoc = ultimoSnapshot.docs[0];
      ultimoInterno = parseInt(ultimoDoc.data().interno, 10);
    }

    // Paso 2: Insertar documentos nuevos con internos incrementales
    for (const utilitario of data) {
      ultimoInterno++;
      utilitario.interno = ultimoInterno; // actualizar el campo interno en el objeto

      await db.collection("utilitarios").doc(ultimoInterno.toString()).set(utilitario);
      console.log(`Documento agregado con interno: ${ultimoInterno}`);
    }

  } catch (error) {
    console.error("Error durante la carga:", error);
  }
}

cargarUtilitarios();

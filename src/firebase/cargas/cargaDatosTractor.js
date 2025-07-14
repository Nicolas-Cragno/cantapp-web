const admin = require("firebase-admin");
const fs = require("fs");

// Cargá tu archivo de credenciales generado desde Firebase Console (Cuenta de servicio)
const serviceAccount = require("../clave-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const data = JSON.parse(fs.readFileSync(__dirname + "/datos/cargaTractor.json", "utf-8"));


data.forEach(async (tractor) => {
  try {
    await db.collection("tractores").doc(tractor.interno.toString()).set(tractor);
    console.log(`Documento agregado: ${tractor.interno}`);
  } catch (error) {
    console.error("Error al agregar documento:", error);
  }
});

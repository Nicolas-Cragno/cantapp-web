const admin = require("firebase-admin");
const fs = require("fs");

// Cargá tu archivo de credenciales generado desde Firebase Console (Cuenta de servicio)
const serviceAccount = require("../clave-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const data = JSON.parse(fs.readFileSync(__dirname + "/datos/cargaFurgon.json", "utf-8"));


data.forEach(async (furgon) => {
  try {
    await db.collection("furgones").doc(furgon.interno.toString()).set(furgon);
    console.log(`Documento agregado: ${furgon.interno}`);
  } catch (error) {
    console.error("Error al agregar documento:", error);
  }
});

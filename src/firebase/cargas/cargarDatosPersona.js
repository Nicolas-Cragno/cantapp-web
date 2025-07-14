const admin = require("firebase-admin");
const fs = require("fs");

// Cargá tu archivo de credenciales generado desde Firebase Console (Cuenta de servicio)
const serviceAccount = require("../clave-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const data = JSON.parse(fs.readFileSync(__dirname + "/datos/cargaPersona.json", "utf-8"));


data.forEach(async (persona) => {
  try {
    await db.collection("personas").doc(persona.dni.toString()).set(persona);
    console.log(`Documento agregado: ${persona.dni}`);
  } catch (error) {
    console.error("Error al agregar documento:", error);
  }
});

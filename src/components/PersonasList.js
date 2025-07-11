// src/components/PersonasList.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const PersonasList = () => {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "personas"));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPersonas(docs);
      } catch (error) {
        console.error("Error al obtener personas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Lista de Personas</h2>
      <ul>
        {personas.map(persona => (
          <li key={persona.id}>
            {persona.apellido}, {persona.nombres} - DNI: {persona.dni} {persona.detalle}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonasList;

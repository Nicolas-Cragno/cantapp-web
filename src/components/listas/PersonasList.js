// src/components/PersonasList.js
import { useEffect, useState } from "react";
import { listarColeccion } from "../../functions/db-functions"; // o el path correcto

const PersonasList = () => {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      const datos = await listarColeccion("personas"); // Usa cache si existe
      setPersonas(datos);
    };

    fetchPersonas();
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

import { useData } from "../../context/DataContext";

const PersonasList = () => {
  const {personas } = useData();  


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

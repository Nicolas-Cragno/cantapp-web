import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FaSpinner } from "react-icons/fa";
import { db } from "../../firebase/firebaseConfig";
import FichaPersonal from "../fichas/FichaPersonal";
import "../css/Tables.css";

const TablaPersonal = (props) => {
    const { tipoPuesto } = props;
    const [personas, setPersonas] = useState([]); // data del listado
    const [filtro, setFiltro] = useState(""); // filtro del listado
    const [loading, setLoading] = useState(true); // loading del listado
    const [personaSeleccionada, setPersonaSeleccionada] = useState(null);

    const titles = {
      "EMPLEADO": "EMPLEADOS",
      "MECANICO": "MECANICOS",
      "CHOFER LARA DISTANCIA": "CHOFERES DE LARGA",
      "CHOFER MOVIMIENTO": "CHOFERES MOVIMIMIENTO",
      "FLETERO": "FLETEROS",
      "ADMINISTRATIVO": "ADMINISTRATIVOS"
    }

    const handleClickPersona = (persona) => { // abrir ficha
      setPersonaSeleccionada(persona);
    }

    const cerrarModal = () => { // cerrar ficha
      setPersonaSeleccionada(null);
    }

    const title = titles[tipoPuesto] || "EMPLEADO";

  useEffect(() => { // listado de personal
  const obtenerDatos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "personas"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const listadoPersonas = data.filter(ps => ps.puesto === tipoPuesto);

      setPersonas(listadoPersonas);
    } catch (error) {
      console.error("Error al  obtener informacion desde db: ", error);
    } finally {
        setLoading(false);
    }
  };

    obtenerDatos();
  }, []);


  // Filtro
  const personasFiltradas = personas.filter((p) => {
  const nombreCompleto = `${p.nombres || ""} ${p.apellido || ""} ${p.detalle || ""}`;
  return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
});

  return (
    <section className="table-container">
        <div className="table-header">
            <h1 className="table-title">{title}</h1>
            <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="table-busqueda"
            />
        </div>

        <ul className="table-lista">
            {loading ? (
                <li className="loading-item"><FaSpinner className='spinner'/></li>
            ) : personasFiltradas.length > 0 ? (
                personasFiltradas.map((persona) => (
                  <li key={persona.id} className="table-item" onClick={() => handleClickPersona(persona)}>
                  <span className="table-nombre">{persona.apellido}, {persona.nombres}</span>
                    <span className="table-info">{persona.detalle}</span>
                </li>
                ))
            ) : (
                <li className="loading-item">No se encontraron {tipoPuesto}.</li>
            )}
        </ul>

        {personaSeleccionada && (
          <FichaPersonal persona={personaSeleccionada} onClose={cerrarModal}/>
        )}

        <div className="table-options">
            <button className="table-agregar">+ AGREGAR</button>
        </div>
    </section>
  );
};

export default TablaPersonal;

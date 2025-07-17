import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions";
import FichaPersonal from "../fichas/FichaPersonal";
import FormularioPersona from "../forms/FormularioPersona";
import "../css/Tables.css";
import { agregar } from "../../functions/db-functions";

const TablaPersonal = (props) => {
  const { tipoPuesto } = props;
  const [personas, setPersonas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  const titles = {
    EMPLEADO: "EMPLEADOS",
    MECANICO: "MECANICOS",
    "CHOFER LARA DISTANCIA": "CHOFERES DE LARGA",
    "CHOFER MOVIMIENTO": "CHOFERES MOVIMIMIENTO",
    FLETERO: "FLETEROS",
    ADMINISTRATIVO: "ADMINISTRATIVOS",
  };

  const title = titles[tipoPuesto] || "EMPLEADO";

  useEffect(() => {
    const obtenerDatos = async () => {
      setLoading(true);
      try {
        const data = await listarColeccion("personas");
        const listadoPersonas = data.filter((ps) => ps.puesto === tipoPuesto);
        setPersonas(listadoPersonas);
      } catch (error) {
        console.error("Error al obtener información desde db: ", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, [tipoPuesto]);

  const handleClickPersona = (persona) => {
    setPersonaSeleccionada(persona);
  };

  const cerrarModal = () => {
    setPersonaSeleccionada(null);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  // Función para guardar nueva persona y actualizar listado
  const guardarNuevaPersona = async (nuevaPersona) => {
    try {
      setLoading(true);
      await agregar("personas", nuevaPersona); // Debes implementar esta función para agregar doc a Firestore
      setModalAgregarVisible(false);
      // Recargar la lista
      const data = await listarColeccion("personas");
      const listadoPersonas = data.filter((ps) => ps.puesto === tipoPuesto);
      setPersonas(listadoPersonas);
    } catch (error) {
      console.error("Error al guardar persona: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtro
  const personasFiltradas = personas.filter((p) => {
    const nombreCompleto = `${p.apellido || ""} ${p.nombres || ""} ${p.detalle || ""}`;
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
          <li className="loading-item">
            <FaSpinner className="spinner" />
          </li>
        ) : personasFiltradas.length > 0 ? (
          personasFiltradas.map((persona) => (
            <li
              key={persona.id}
              className="table-item"
              onClick={() => handleClickPersona(persona)}
            >
              <span className="table-nombre">
                {persona.apellido}, {persona.nombres}
              </span>
              <span className="table-info">{persona.detalle}</span>
            </li>
          ))
        ) : (
          <li className="loading-item">No se encontraron {tipoPuesto}.</li>
        )}
      </ul>

      {personaSeleccionada && (
        <FichaPersonal persona={personaSeleccionada} onClose={cerrarModal} />
      )}

      {modalAgregarVisible && (
        <FormularioPersona
          tipoPuesto={tipoPuesto}
          onClose={cerrarModalAgregar}
          onGuardar={guardarNuevaPersona}
        />
      )}

      <div className="table-options">
        <button
          className="table-agregar"
          onClick={() => setModalAgregarVisible(true)}
        >
          + AGREGAR
        </button>
      </div>
    </section>
  );
};

export default TablaPersonal;

import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions";
import FichaPersonal from "../fichas/FichaPersonal";
import FormularioPersona from "../forms/FormularioPersona";
import "../css/Tables.css";

const TablaPersonal = ({ tipoPuesto }) => {
  const [personas, setPersonas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  // Cargar personas filtradas por puesto
  const cargarPersonas = async () => {
    setLoading(true);
    try {
      const data = await listarColeccion("personas");
      const listadoPersonas = data.filter((p) => p.puesto === tipoPuesto);
      setPersonas(listadoPersonas);
    } catch (error) {
      console.error("Error al obtener información desde db: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, [tipoPuesto]);

  // Abrir ficha persona
  const handleClickPersona = (persona) => {
    setPersonaSeleccionada(persona);
  };

  // Cerrar ficha o formulario
  const cerrarModal = () => {
    setPersonaSeleccionada(null);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  // Guardar nueva persona o editar existente y recargar lista
  const handleGuardar = async () => {
    await cargarPersonas();
    setModalAgregarVisible(false);
    setPersonaSeleccionada(null);
  };

  // Filtrado simple
  const personasFiltradas = personas.filter((p) => {
    const nombreCompleto = `${p.apellido || ""} ${p.nombres || ""} ${p.detalle || ""}`;
    return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-title">{tipoPuesto}</h1>
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
              key={persona.dni}
              className="table-item"
              onClick={() => handleClickPersona(persona)}
            >
              <span className="table-nombre">
                <strong>{persona.apellido}</strong> {persona.nombres}
              </span>
              <span className="table-info">{persona.detalle}</span>
            </li>
          ))
        ) : (
          <li className="loading-item">No se encontraron {tipoPuesto}.</li>
        )}
      </ul>

      {personaSeleccionada && (
        <FichaPersonal
          persona={personaSeleccionada}
          onClose={cerrarModal}
          onGuardar={handleGuardar}
        />
      )}

      {modalAgregarVisible && (
        <FormularioPersona
          tipoPuesto={tipoPuesto}
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
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

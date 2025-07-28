import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions";
import FichaPersonal from "../fichas/FichaPersonal";
import FormularioPersona from "../forms/FormularioPersona";
import "../css/Tables.css";
import { nombreEmpresa } from "../../functions/data-functions";
import LogoEmpresa from "../LogoEmpresa";

const TablaPersonal = ({ tipoPuesto }) => {
  const [personas, setPersonas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  // Cargar personas filtradas por puesto
  const cargarPersonas = async (usarCache=true) => {
    setLoading(true);
    try {
      const data = await listarColeccion("personas", usarCache);
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
    await cargarPersonas(false);
    setModalAgregarVisible(false);
    setPersonaSeleccionada(null);
  };

  // Filtrado simple
  const personasFiltradas = personas.filter((p) => {
    const nombreCompleto = `${p.apellido || ""} ${p.nombres || ""} ${p.detalle || ""}`;
    return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
  }).sort((a,b) => {
    const pA = (a.apellido || "").toLowerCase();
    const pB = (b.apellido || "").toLowerCase();
    return pA.localeCompare(pB);
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

      {loading ? (
        <div className="loading-item">
          <FaSpinner className="spinner"/>
        </div>
      ) : (
        <div className="table-scroll-wrapper">
          <table className="table-lista">
            <thead className="table-titles">
              <tr>
                <th>DOCUMENTO</th>
                <th>APELLIDO/S</th>
                <th>NOMBRE/S</th>
                <th>EMPRESA</th>
              </tr>
            </thead>
          </table>

          <div className="table-body-wrapper">
            <table className="table-lista">
              <tbody className="table-body">
                {personasFiltradas.map((persona) => (
                  <tr key={persona.dni} onClick={() => handleClickPersona(persona)} className="table-item">
                    <td>{persona.dni}</td>
                    <td><strong>{persona.apellido}</strong></td>
                    <td>{persona.nombres}</td>
                    <td><LogoEmpresa cuitEmpresa={persona.empresa}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

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

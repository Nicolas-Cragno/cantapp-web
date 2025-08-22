import { useState, useEffect, use } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions";
import FichaPersonal from "../fichas/FichaPersonal";
import FormularioPersona from "../forms/FormularioPersona";
import "./css/Tables.css";
import { obtenerCuitPorNombre } from "../../functions/data-functions";
import { nombreEmpresa } from "../../functions/data-functions";
import LogoPersonal from "../../assets/logos/logopersonal-w.png";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";

const TablaPersonal = ({ tipoPuesto }) => {
  const [personas, setPersonas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [cantPersonasTC, setCantPersonasTC] = useState(0);
  const [cantPersonasEX, setCantPersonasEX] = useState(0);
  const [cantPersonasTA, setCantPersonasTA] = useState(0);
  const [cantPersonasX, setCantPersonasX] = useState(0);
  const [filtroTC, setFiltroTC] = useState(true);
  const [filtroEX, setFiltroEX] = useState(true);
  const [filtroTA, setFiltroTA] = useState(true);
  const [filtroX, setFiltroX] = useState(true);

  // Cargar personas filtradas por puesto && cant de personas por empresa
  const cargarPersonas = async (usarCache = true) => {
    setLoading(true);
    try {
      const data = await listarColeccion("personas", usarCache);
      const empresaTC = Number(obtenerCuitPorNombre("TRANSPORTES CANTARINI"));
      const empresaEX = Number(obtenerCuitPorNombre("EXPRESO CANTARINI"));
      const empresaTA = Number(
        obtenerCuitPorNombre("TRANSAMERICA TRANSPORTES")
      );
      const listadoPersonas = data.filter((p) => p.puesto === tipoPuesto);
      setCantPersonasTC(
        data.filter((p) => p.empresa === empresaTC && p.puesto === tipoPuesto)
          .length
      );
      setCantPersonasEX(
        data.filter((p) => p.empresa === empresaEX && p.puesto === tipoPuesto)
          .length
      );
      setCantPersonasTA(
        data.filter((p) => p.empresa === empresaTA && p.puesto === tipoPuesto)
          .length
      );
      setCantPersonasX(
        data.filter(
          (p) =>
            p.empresa !== empresaTC &&
            p.empresa !== empresaEX &&
            p.empresa !== empresaTA &&
            p.puesto === tipoPuesto
        ).length
      );
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
  const personasFiltradas = personas
    .filter((p) => {
      const nombreCompleto = `${p.dni || ""} ${p.apellido || ""} ${
        p.nombres || ""
      }`;
      return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
    })
    .filter((p) => {
      if (
        (filtroTC && p.empresa === 30610890403) ||
        p.empresa === "30610890403"
      )
        return true;
      if (
        (filtroTA && p.empresa === 30683612916) ||
        p.empresa === "30683612916"
      )
        return true;
      if (
        (filtroEX && p.empresa === 30644511304) ||
        p.empresa === "30644511304"
      )
        return true;
      if ((filtroX && p.empresa === null) || p.empresa === "") return true;
    })
    .sort((a, b) => {
      const pA = (a.apellido || "").toLowerCase();
      const pB = (b.apellido || "").toLowerCase();
      return pA.localeCompare(pB);
    });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoPersonal} alt="" className="table-logo" />
          {tipoPuesto}
        </h1>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="table-busqueda"
        />
        <div className="table-checked">
          <label className="table-check">
            <input
              type="checkbox"
              checked={filtroTC}
              onChange={(e) => setFiltroTC(e.target.checked)}
              className="check-input"
            />
            TC ({cantPersonasTC})
          </label>
          <label className="table-check">
            <input
              type="checkbox"
              checked={filtroEX}
              onChange={(e) => setFiltroEX(e.target.checked)}
              className="check-input"
            />
            EX ({cantPersonasEX})
          </label>
          <label className="table-check">
            <input
              type="checkbox"
              checked={filtroTA}
              onChange={(e) => setFiltroTA(e.target.checked)}
              className="check-input"
            />
            TA ({cantPersonasTA})
          </label>
          <label className="table-check">
            <input
              type="checkbox"
              checked={filtroX}
              onChange={(e) => setFiltroX(e.target.checked)}
              className="check-input"
            />
            Innactivos ({cantPersonasX})
          </label>
        </div>
      </div>

      {loading ? (
        <div className="loading-item">
          <FaSpinner className="spinner" />
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
                  <tr
                    key={persona.dni}
                    onClick={() => handleClickPersona(persona)}
                    className="table-item"
                  >
                    <td>{persona.dni}</td>
                    <td>
                      <strong>{persona.apellido}</strong>
                    </td>
                    <td>{persona.nombres}</td>
                    <td>
                      <LogoEmpresaTxt cuitEmpresa={persona.empresa} />
                    </td>
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

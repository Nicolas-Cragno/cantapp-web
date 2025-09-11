import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useData } from "../../context/DataContext";
import FichaPersonal from "../fichas/FichaPersonal";
import FormularioPersona from "../forms/FormularioPersona";
import "./css/Tables.css";
import LogoPersonal from "../../assets/logos/logopersonal-w.png";

const TablaContratados = ({ tipoPuesto }) => {
  const { personas, loading } = useData();

  const [filtro, setFiltro] = useState("");
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

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
    setModalAgregarVisible(false);
    setPersonaSeleccionada(null);
  };

  // Filtrado simple
  const personasFiltradas = personas
    .filter((p) => {
      const nombreCompleto = `${p.dni || ""} ${p.apellido || ""} ${
        p.nombres || ""
      } ${p.detalle} ${p.tractor.dominio} ${p.tractor.marca} ${
        p.tractor.modelo
      } ${p.furgonPropio}`;
      return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
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
                {/*
                <th>EMPRESA</th>
                */}
                <th>DETALLE</th>
                {tipoPuesto === "FLETERO" && (
                  <>
                    <th>TRACTOR</th>
                    <th>FURGON</th>
                  </>
                )}
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
                    {/*
                    <td>
                      <LogoProveedorTxt cuitEmpresa={persona.empresa} />
                    </td>
                    */}

                    <td>
                      {persona.flete ? persona.flete : null}{" "}
                      {persona.detalle
                        ? persona.flete
                          ? " (" + persona.detalle + ")"
                          : persona.detalle
                        : null}
                    </td>
                    {tipoPuesto === "FLETERO" && (
                      <>
                        <td>
                          {persona.tractor.marca
                            ? persona.tractor.marca +
                              " " +
                              (persona.tractor.modelo > 0
                                ? persona.tractor.modelo
                                : " - ")
                            : ""}
                          <strong>{persona.tractor.dominio}</strong>
                        </td>
                        <td>{persona.furgonPropio}</td>
                      </>
                    )}
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

export default TablaContratados;

// ----------------------------------------------------------------------- imports externos
import { useEffect, useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  buscarPersona,
  buscarDominio,
  formatearFecha,
  formatearHora,
  buscarMarca,
} from "../../functions/dataFunctions";
import FormGestor from "../forms/FormGestor";
import TextButton from "../buttons/TextButton";
import chequeosPorteria from "../../functions/data/chequeosPorteria.json";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Fichas.css";

const FichaEventoPorteria = ({ elemento, onClose, onGuardar }) => {
  const { personas, tractores, furgones, vehiculos } = useData();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargado, setCargado] = useState(false);
  const [distincion, setDistincion] = useState("tractor");
  const [esFletero, setEsFletero] = useState(false);
  const [modificaciones, setModificaciones] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!elemento) return null;

      if (elemento.cargado) {
        setCargado(true);
      }

      if (elemento.distincion) {
        setDistincion(elemento.distincion);
      }

      if (elemento.esFletero) {
        setEsFletero(true);
      }

      // Modificaciones
      let modificacionesArray = [];
      if (
        elemento.modificaciones !== undefined &&
        elemento.modificaciones !== null
      ) {
        modificacionesArray = Array.isArray(elemento.modificaciones)
          ? elemento.modificaciones
          : [elemento.modificaciones];
      }

      setModificaciones(modificacionesArray);
    };
    cargarDatos();
  }, [elemento]);

  if (!elemento) return null;
  const fechaFormateada = formatearFecha(elemento?.fecha);
  const horaFormateada = formatearHora(elemento?.fecha);

  const handleGuardado = async (eventoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(eventoModificado);
  };

  const onCloseFormEdit = () => {
    setModoEdicion(false);
  };

  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}>
              ✕
            </button>
            <h1 className="event-subtipo">
              {elemento.id ? elemento.id : "EVENTO"}
            </h1>
            <hr />
            <div className="hora">
              <spam>{fechaFormateada}</spam>
              <spam>{horaFormateada} HS</spam>
            </div>
            <div className="ficha-info">
              <p className="ficha-type">
                <strong>
                  {elemento.tipo === "ENTRADA" ? (
                    <>
                      <FaSignInAlt className="ficha-type-logo" /> ENTRADA AL
                      PREDIO
                    </>
                  ) : elemento.tipo === "SALIDA" ? (
                    <>
                      <FaSignOutAlt className="ficha-type-logo" />
                      SALIDA DEL PREDIO
                    </>
                  ) : null}
                </strong>
              </p>
              {/* chofer / persona */}
              <p>
                {distincion === "tractor" ? (
                  <strong>Chofer: </strong>
                ) : (
                  <strong>Persona: </strong>
                )}{" "}
                {buscarPersona(personas, elemento.persona)}
              </p>
              {/* operador */}
              <p>
                <strong>Operador: </strong>{" "}
                {buscarPersona(personas, elemento.operador)}
              </p>
              {/* asfas */}
              {distincion === "tractor" && !esFletero ? (
                <>
                  <p>
                    <strong>Tractor: </strong>
                    {elemento.tractor} (
                    {buscarDominio(elemento.tractor, tractores)})
                  </p>
                  <p>
                    <strong>Furgón: </strong>
                    {cargado ? (
                      <>
                        {elemento.furgon} (
                        {buscarDominio(elemento.furgon, furgones)}){" "}
                        <span className="infobox redbox">CARGADO</span>{" "}
                      </>
                    ) : elemento.furgon ? (
                      <>
                        {elemento.furgon} (
                        {buscarDominio(elemento.furgon, furgones)}){" "}
                        <span className="infobox greenbox">VACIO</span>{" "}
                      </>
                    ) : null}
                  </p>
                </>
              ) : esFletero || elemento.vehiculo ? (
                <>
                  {" "}
                  <p>
                    <strong>Vehiculo: </strong>
                    {elemento.vehiculo} (
                    {buscarMarca(elemento.vehiculo, vehiculos)})
                  </p>
                </>
              ) : null}

              <p>
                <strong>Detalle: </strong> {elemento.detalle || "-"}
              </p>
            </div>
            {distincion === "tractor" ? (
              <>
                <label>
                  <strong>Chequeos</strong>
                </label>
                <div className="checkbox-list">
                  {chequeosPorteria.map(({ key, label }) => {
                    const valor = elemento.chequeos?.[key];
                    return (
                      <span
                        key={key}
                        className={`chequeo-item ${
                          valor ? "chequeo-ok" : "chequeo-fail"
                        }`}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : null}
            <div className="ficha-data">
              {elemento.usuario ? (
                <p>
                  Cargado por <strong>{elemento.usuario}</strong>{" "}
                </p>
              ) : null}
            </div>
            {modificaciones.length > 0 && (
              <>
                <p className="ficha-info-title">
                  <strong>Modificaciones</strong>
                </p>
                <div className="ficha-info container">
                  {modificaciones.map((mod, index) => (
                    <p key={index} className="item-list">
                      <strong>{mod.usuario}</strong>
                      {" ("}
                      {formatearFecha(mod.fecha)} {formatearHora(mod.fecha)}
                      {" hs)"}
                    </p>
                  ))}
                </div>
              </>
            )}
            <div className="ficha-buttons">
              <TextButton text="Editar" onClick={() => setModoEdicion(true)} />
            </div>
          </div>
        </div>
      ) : (
        <FormGestor
          tipo="porteria"
          elemento={elemento}
          onClose={onCloseFormEdit}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaEventoPorteria;

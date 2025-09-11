import "./css/Fichas.css";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import { useEffect, useState } from "react";
import FormularioEventoPorteria from "../forms/FormularioEventoPorteria";
import {
  buscarNombrePorDni,
  listarColeccion,
} from "../../functions/db-functions";
import chequeosPorteria from "../../functions/data/chequeosPorteria.json";
import { FaSignInAlt } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

const FichaEventoPorteria = ({ evento, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState("");
  const [operador, setOperador] = useState("");
  const [tractor, setTractor] = useState("");
  const [furgon, setFurgon] = useState("");
  const [cargado, setCargado] = useState(false);
  const [modificaciones, setModificaciones] = useState([]);

  const fechaFormateada = formatearFecha(evento.fecha);
  const horaFormateada = formatearHora(evento.fecha);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!evento) return null;

      if (evento.persona) {
        const nombrePersona = await buscarNombrePorDni(evento.persona);
        setNombre(nombrePersona);
      }

      if (evento.operador) {
        const nombrePersona = await buscarNombrePorDni(evento.operador);
        setOperador(nombrePersona);
      }

      if (evento.tractor) {
        const tractores = await listarColeccion("tractores");
        const dTractor = tractores.find((t) => t.interno === evento.tractor);
        if (dTractor) {
          setTractor(`${dTractor.dominio} (${dTractor.interno})`);
        }
      }

      if (evento.furgon) {
        const furgones = await listarColeccion("furgones");
        const dFurgon = furgones.find((f) => f.interno === evento.furgon);
        if (dFurgon) {
          setFurgon(`${dFurgon.dominio} (${dFurgon.interno})`);
        }
      }

      if (evento.cargado) {
        setCargado(true);
      }

      // Modificaciones
      let modificacionesArray = [];
      if (
        evento.modificaciones != undefined &&
        evento.modificaciones !== null
      ) {
        modificacionesArray = Array.isArray(evento.modificaciones)
          ? evento.modificaciones
          : [evento.modificaciones];
      }

      setModificaciones(modificacionesArray);
    };
    cargarDatos();
  }, [evento]);

  if (!evento) return null;

  const handleGuardado = async (eventoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(eventoModificado);
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
              {evento.id ? evento.id : "EVENTO"}
            </h1>
            <hr />
            <div className="hora">
              <spam>{fechaFormateada}</spam>
              <spam>{horaFormateada} HS</spam>
            </div>
            <div className="ficha-info">
              <p className="ficha-type">
                <strong>
                  {evento.tipo === "ENTRADA" ? (
                    <>
                      <FaSignInAlt className="ficha-type-logo" /> ENTRADA AL
                      PREDIO
                    </>
                  ) : evento.tipo === "SALIDA" ? (
                    <>
                      <FaSignOutAlt className="ficha-type-logo" />
                      SALIDA DEL PREDIO
                    </>
                  ) : null}
                </strong>
              </p>
              <p>
                <strong>Chofer: </strong> {nombre}
              </p>
              <p>
                <strong>Operador: </strong> {operador}
              </p>
              <p>
                <strong>Tractor: </strong>
                {tractor}
              </p>
              <p>
                <strong>Furgón: </strong>
                {cargado ? (
                  <>
                    {furgon} <span className="infobox redbox">CARGADO</span>{" "}
                  </>
                ) : evento.furgon ? (
                  <>
                    {furgon} <span className="infobox greenbox">VACIO</span>{" "}
                  </>
                ) : null}
              </p>
              <p>
                <strong>Detalle: </strong> {evento.detalle || "-"}
              </p>
            </div>
            <label>
              <strong>Chequeos</strong>
            </label>
            <div className="checkbox-list">
              {chequeosPorteria.map(({ key, label }) => {
                const valor = evento.chequeos?.[key];
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
            <div className="ficha-data">
              {evento.usuario ? (
                <p>
                  Cargado por <strong>{evento.usuario}</strong>{" "}
                </p>
              ) : (
                " "
              )}
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
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormularioEventoPorteria
          evento={evento}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaEventoPorteria;

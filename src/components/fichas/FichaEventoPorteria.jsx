import "../css/Fichas.css";
import { formatearFecha } from "../../functions/data-functions";
import { useState } from "react";
import FormularioEventoPorteria from "../forms/FormularioEventoPorteria";

const FichaEventoPorteria = ({ evento, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  if (!evento) return null;

  const fechaFormateada = formatearFecha(evento.fecha);

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
            <h1 className="event-subtipo">{evento.subtipo}</h1>
            <hr />
            <div className="ficha-info">
              <p><strong>Persona: </strong> {evento.persona || "-"}</p>
              <p><strong>Tractor: </strong> {evento.tractor || "-"}</p>
              <p><strong>Furgón: </strong> {evento.furgon || "-"}</p>
              <p><strong>Fecha: </strong> {fechaFormateada || "-"}</p>
              <p><strong>Área: </strong> {evento.area || "-"}</p>
              <p><strong>Detalle: </strong> {evento.detalle || "-"}</p>
            </div>
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

import "./css/Fichas.css";
import { formatearFecha } from "../../functions/data-functions";
import { useState } from "react";
import FormularioViaje from "../forms/FormularioViaje";

const FichaViaje = ({ viaje, onGuardar, onClose }) => {
  const [modoEdicion, setModoEdicion] = useState(false);

  if (!viaje) return null;

  const fechaFormateada = viaje.fecha ? formatearFecha(viaje.fecha) : "-";

  const handleGuardado = async (viajeModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(viajeModificado);
  };

  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}>
              ✕
            </button>
            <h1 className="event-subtipo">{"VIAJE " + (viaje.id || "-")}</h1>
            <hr />
            <div className="hora">
              <span>{fechaFormateada}</span>
            </div>
            <div className="ficha-info">
              <p>
                <strong>Chofer: </strong> {viaje.chofer || "-"}
              </p>
              <p>
                <strong>Tractor: </strong> {viaje.tractor || "-"}
              </p>
              <p>
                <strong>Satelital: </strong> {viaje.satelital || "-"}
              </p>
              <p>
                <strong>Detalle: </strong> {viaje.detalle || "-"}
              </p>
              <p>
                <strong>Litros Ticket: </strong> {viaje.litrosticket || 0}
              </p>
              <p>
                <strong>Litros Reales: </strong> {viaje.litrosreales || 0}
              </p>
              <p>
                <strong>Kilómetros: </strong> {viaje.km || 0}
              </p>
              <p>
                <strong>Diferencia: </strong> {viaje.diferencia || 0}
              </p>
              <p>
                <strong>Promedio: </strong> {viaje.promedio || 0}
              </p>
            </div>
            <div className="ficha-data">
              {viaje.usuario && (
                <p>
                  Cargado por <strong>{viaje.usuario}</strong>
                </p>
              )}
            </div>
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormularioViaje
          viaje={viaje}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaViaje;

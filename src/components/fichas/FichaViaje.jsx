// ----------------------------------------------------------------------- imports externos
import { useState } from "react";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  formatearFecha,
  colorSatelital,
  colorBatman,
  colorPromedio,
} from "../../functions/dataFunctions";
import FormViaje from "../forms/FormViaje";

const FichaViaje = ({ elemento, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState(null);
  const [vacio, setVacio] = useState(true); // viaje con/sin furgon
  const [loading, setLoading] = useState(false);

  const { personas, tractores, furgones } = useData();

  if (!elemento) return null;

  const fechaFormateada = elemento.fecha ? formatearFecha(elemento.fecha) : "-";

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
            <h1 className="event-subtipo">{"VIAJE " + (elemento.id || "-")}</h1>
            <hr />
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <>
                {" "}
                <div className="hora">
                  <span>{fechaFormateada}</span>
                </div>
                <div className="ficha-info">
                  <p>
                    <strong>Chofer: </strong> {formData?.chofer || "-"}
                  </p>
                  <p>
                    <strong>Tractor: </strong>{" "}
                    {formData?.tractor + " - " + formData?.dominioTractor ||
                      "-"}
                  </p>
                  {!vacio ? (
                    <p>
                      <strong>Furgon: </strong>{" "}
                      {formData?.furgon + " - " + formData?.dominioFurgon ||
                        "-"}
                    </p>
                  ) : null}
                </div>
                <div className="ficha-subtitle">
                  <h6>
                    <strong>Control combustible</strong>
                  </h6>
                  <h6
                    style={{
                      backgroundColor: colorSatelital(elemento.satelital),
                      color: "#fff",
                      padding: "0.2rem",
                    }}
                  >
                    {elemento.satelital || "-"}
                  </h6>
                </div>
                <div className="ficha-info">
                  <p>
                    <strong>Litros Ticket: </strong>{" "}
                    {elemento.litrosticket || 0}
                  </p>
                  {formData?.satelital !== "N/F" ? (
                    <p>
                      <strong>Litros Reales: </strong>{" "}
                      {elemento.litrosreales || 0}
                    </p>
                  ) : null}
                  <p>
                    <strong>Kilómetros: </strong> {elemento.km || 0}
                  </p>
                </div>
                <div className="ficha-card-info">
                  {formData?.satelital !== "N/F" ? (
                    <div
                      className="ficha-card-info-item"
                      style={{
                        borderColor: colorBatman(formData?.diferencia),
                        color: colorBatman(formData?.diferencia),
                      }}
                    >
                      <span>DIFERENCIA</span>
                      <h1>
                        {formData?.diferencia
                          ? formData?.diferencia.toFixed(2)
                          : 0.0}
                      </h1>
                      <span>LITROS</span>
                    </div>
                  ) : null}
                  <div
                    className="ficha-card-info-item"
                    style={{
                      borderColor: colorPromedio(formData?.promedio),
                      color: colorPromedio(formData?.promedio),
                    }}
                  >
                    <span>PROMEDIO</span>
                    <h1>
                      {formData?.promedio ? formData?.promedio.toFixed(2) : 0.0}
                    </h1>
                    <span>LTS CADA 100 KM</span>
                  </div>
                </div>
                <div className="ficha-data">
                  {elemento.usuario && (
                    <p>
                      Cargado por <strong>{elemento.usuario}</strong>
                    </p>
                  )}
                </div>
                <div className="ficha-buttons">
                  <button onClick={() => setModoEdicion(true)}>Editar</button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <FormViaje
          viaje={elemento}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaViaje;

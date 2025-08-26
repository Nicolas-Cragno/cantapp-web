import "./css/Fichas.css";
import {
  formatearFecha,
  buscarDominioT,
  colorSatelital,
  colorBatman,
  colorPromedio,
} from "../../functions/data-functions";
import CardInfo from "../cards/CardInfo";
import { useState, useEffect } from "react";
import FormularioViaje from "../forms/FormularioViaje";
import { FaPray } from "react-icons/fa";

const FichaViaje = ({ viaje, onGuardar, onClose }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState(null);
  const [vacio, setVacio] = useState(true); // viaje con/sin furgon
  const [dominioTractor, setDominioTractor] = useState(null);
  //const [dominioFurgon, setDominioFurgon] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarFicha = async () => {
    setLoading(true);

    try {
      const dominioT = await buscarDominioT(viaje.tractor);

      setFormData({
        ...viaje,
        dominioTractor: dominioT,
        //dominioFurgon: dominioF,
        fechaFormateada: viaje.fecha ? formatearFecha(viaje.fecha) : "-",
      });

      if (formData.furgon) setVacio(false);
    } catch (error) {
      console.error("Error al cargar datos del viaje: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFicha();
  }, [viaje]);

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
                      backgroundColor: colorSatelital(viaje.satelital),
                      color: "#fff",
                      padding: "0.2rem",
                    }}
                  >
                    {viaje.satelital || "-"}
                  </h6>
                </div>
                <div className="ficha-info">
                  <p>
                    <strong>Litros Ticket: </strong> {viaje.litrosticket || 0}
                  </p>
                  {formData?.satelital !== "N/F" ? (
                    <p>
                      <strong>Litros Reales: </strong> {viaje.litrosreales || 0}
                    </p>
                  ) : null}
                  <p>
                    <strong>Kilómetros: </strong> {viaje.km || 0}
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
                  {viaje.usuario && (
                    <p>
                      Cargado por <strong>{viaje.usuario}</strong>
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

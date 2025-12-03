// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Select from "react-select";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  formatearFecha,
  colorBatman,
  colorPromedio,
} from "../../functions/dataFunctions";
import TextButton from "../buttons/TextButton";
import ModalTramos from "../modales/ModalTramos";
import ModalSatelital from "../modales/ModalSatelital";
import "./css/Forms.css";

export default function FormViaje({ elemento = {}, onClose, onGuardar }) {
  const viaje = elemento || {};
  const [tipoSeleccionado, setTipoSeleccionado] = useState("viaje");
  const [formData, setFormData] = useState({
    fecha: viaje.fecha
      ? formatearFecha(viaje.fecha)
      : formatearFecha(new Date()),
    chofer: viaje.chofer || "",
    tractor: viaje.tractor || "",
    satelital: viaje.satelital || "",
    litrosticket: viaje.litrosticket || 0,
    litrosreales: viaje.litrosreales || 0,
    km: viaje.km || 0,
    diferencia: viaje.diferencia || 0,
    promedio: viaje.promedio || 0,
    detalle: viaje.detalle || "",
    tipo: viaje.tipo,
  });
  const { personas, tractores, furgones, estaciones } = useData();

  const [uploading, setUploading] = useState(false);
  const [tramos, setTramos] = useState([]);
  const [finalizado, setFinalizado] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalTramosVisible, setModalTramosVisible] = useState(false);
  const [ModalSatelitalVisible, setModalSatelitalVisible] = useState(false);
  const [litrosTicket, setListrosTicket] = useState(0);
  const [litrosSatelital, setLitrosSatelital] = useState(0);
  const [distancia, setDistancia] = useState(0);
  const [diferencia, setDiferencia] = useState(0);
  const [promedio, setPromedio] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const totalLitrosTickets = tramos.reduce(
      (acum, tramo) => acum + (Number(tramo.litros) || 0),
      0
    );

    const calcularDiferencia = litrosSatelital - totalLitrosTickets;
    const calcularPromedio =
      (100 * Number(totalLitrosTickets)) / Number(distancia);
    setListrosTicket(totalLitrosTickets);

    setDiferencia(calcularDiferencia);
    setPromedio(calcularPromedio);
  }, [tramos]);

  const choferes = personas.filter(
    (p) => p.especializacion === "LARGA DISTANCIA" && p.estado
  );

  const choferesMov = personas.filter(
    (p) => p.especializacion === "MOVIMIENTO" && p.estado
  );

  const cerrarModalTractor = () => {
    setModalTractorVisible(false);
  };
  const handleClickTractor = async () => {
    setModalTractorVisible(true);
  };
  const handleClickFurgon = async () => {
    setModalFurgonVisible(true);
  };
  const handleClickVehiculo = async () => {
    setModalVehiculoVisible(true);
  };
  const handleClickPersona = async () => {
    setModalPersonaVisible(true);
  };
  const cerrarModalFurgon = () => {
    setModalFurgonVisible(false);
  };
  const cerrarModalVehiculo = () => {
    setModalVehiculoVisible(false);
  };
  const cerrarModalPersona = () => {
    setModalPersonaVisible(false);
  };

  return (
    <div className="form">
      <div className="form-content">
        <div className="form-header">
          <h2>{viaje.id ? "Editar Viaje" : "Nuevo Viaje"}</h2>
          <p>* campo obligatorio</p>
          <hr />
        </div>

        <div className="type-container-small">
          <button
            type="button"
            className={
              tipoSeleccionado === "viaje"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => setTipoSeleccionado("viaje")}
          >
            VIAJE {tipoSeleccionado === "viaje" ? " *" : null}{" "}
          </button>
          <button
            type="button"
            className={
              tipoSeleccionado === "movimiento"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => setTipoSeleccionado("movimiento")}
          >
            MOVIMIENTO {tipoSeleccionado === "movimiento" ? " *" : null}{" "}
          </button>
        </div>
        {/* Formulario */}
        {tipoSeleccionado === "viaje" ? (
          <form onSubmit={handleSubmit}>
            <label>Fecha de inicio *</label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
            />
            <label>
              {/* choferes larga distancia / choferes mov */}
              Chofer *
              <div className="select-with-button">
                {" "}
                {tipoSeleccionado === "viaje" ? (
                  <Select
                    className="select-grow"
                    options={choferes
                      .map((c) => ({
                        value: c.id,
                        label: `${c.apellido} ${c.nombres} (DNI: ${c.dni})`,
                        apellido: c.apellido, //para odenar
                      }))
                      .sort((a, b) => a.apellido.localeCompare(b.apellido))}
                    value={
                      formData.persona
                        ? {
                            value: formData.persona,
                            label:
                              personas.find((p) => p.id === formData.persona)
                                ?.apellido +
                              " " +
                              personas.find((p) => p.id === formData.persona)
                                ?.nombres +
                              ` (DNI: ${formData.persona})`,
                          }
                        : null
                    }
                    onChange={(opt) =>
                      setFormData({
                        ...formData,
                        persona: opt ? opt.value : "",
                      })
                    }
                    placeholder=""
                    isClearable
                    required={tipoSeleccionado === "viaje"}
                  />
                ) : (
                  <Select
                    className="select-grow"
                    options={choferesMov
                      .map((c) => ({
                        value: c.id,
                        label: `${c.apellido} ${c.nombres} (DNI: ${c.dni})`,
                        apellido: c.apellido, //para odenar
                      }))
                      .sort((a, b) => a.apellido.localeCompare(b.apellido))}
                    value={
                      formData.persona
                        ? {
                            value: formData.persona,
                            label:
                              personas.find((p) => p.id === formData.persona)
                                ?.apellido +
                              " " +
                              personas.find((p) => p.id === formData.persona)
                                ?.nombres +
                              ` (DNI: ${formData.persona})`,
                          }
                        : null
                    }
                    onChange={(opt) =>
                      setFormData({
                        ...formData,
                        persona: opt ? opt.value : "",
                      })
                    }
                    placeholder=""
                    isClearable
                    required={tipoSeleccionado === "movimiento"}
                  />
                )}
                <TextButton
                  text="+"
                  className="mini-btn"
                  onClick={handleClickPersona}
                />
              </div>
            </label>
            <label>
              {/* tractor */} Tractor *
              <div className="select-with-button">
                <Select
                  className="select-grow"
                  options={tractores
                    .map((t) => ({
                      value: t.interno,
                      label: `${t.dominio} (${t.interno}) satelital`,
                      int: t.interno,
                    }))
                    .sort((a, b) => a.int - b.int)}
                  value={
                    formData.tractor
                      ? {
                          value: formData.tractor,
                          label:
                            tractores.find(
                              (t) => t.interno === formData.tractor
                            )?.dominio + ` (${formData.tractor})`,
                        }
                      : null
                  }
                  onChange={(opt) =>
                    setFormData({
                      ...formData,
                      tractor: opt ? opt.value : "",
                    })
                  }
                  placeholder=""
                  isClearable
                  required
                />
                <TextButton
                  text="+"
                  className="mini-btn"
                  onClick={handleClickTractor}
                />
              </div>
            </label>{" "}
            <br />
            {/* Tramos */}
            <TextButton
              text="Calcular Combustible"
              onClick={() => setModalTramosVisible(true)}
            />
            <span className="form-label">{litrosTicket.toFixed(2)} lts</span>
            <br />
            <br />
            <TextButton
              text="Satelital"
              onClick={() => setModalSatelitalVisible(true)}
            />
            <span className="form-label">
              {litrosSatelital.toFixed(2)} lts | {distancia.toFixed(2)} km
            </span>
            <br />
            <br />
            {/* promedios y diferencias */}
            <div className="form-info">
              <div
                className="ficha-card-info-item"
                style={{
                  borderColor: colorBatman(diferencia),
                  color: colorBatman(diferencia),
                }}
              >
                <span>DIFERENCIA</span>
                <h1>{diferencia.toFixed(2)}</h1>
                <span>LITROS</span>
              </div>

              <div
                className="ficha-card-info-item"
                style={{
                  borderColor: colorPromedio(promedio),
                  color: colorPromedio(promedio),
                }}
              >
                <span>PROMEDIO</span>
                <h1>{promedio.toFixed(2)}</h1>
                <span>LITROS C/100 KM</span>
              </div>
            </div>
            <br />
            <label>Detalle</label>
            <textarea
              value={formData.detalle}
              onChange={(e) =>
                setFormData({ ...formData, detalle: e.target.value })
              }
            />
            {modalTramosVisible && (
              <ModalTramos
                onClose={() => setModalTramosVisible(false)}
                tramos={tramos}
                setTramos={setTramos}
                estaciones={estaciones}
              />
            )}
            {ModalSatelitalVisible && (
              <ModalSatelital
                litros={litrosSatelital}
                setLitros={setLitrosSatelital}
                distancia={distancia}
                setDistancia={setDistancia}
                onClose={() => setModalSatelitalVisible(false)}
              />
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Fecha de inicio *</label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
            />
          </form>
        )}
        <div className="form-buttons">
          <TextButton
            text={uploading ? "Guardando..." : "Guardar"}
            onClick={handleSubmit}
            type="submit"
            disabled={uploading}
          />
          <TextButton text="Cancelar" onClick={onClose} type="button" />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { formatearFechaCorta } from "../../functions/dataFunctions";
import TextButton from "../buttons/TextButton";
import TablaColeccion from "../tablas/TablaColeccion";
import { agregarEvento } from "../../functions/eventFunctions";
import { modificar } from "../../functions/dbFunctions";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Forms.css";

import { formatearFecha } from "../../functions/data-functions";

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
  const [satelitales, setSatelitales] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [tramos, setTramos] = useState([]);
  const [nuevoTramo, setNuevoTramo] = useState({
    fecha: new Date(),
    litros: 0,
    lugar: "",
  });
  const [finalizado, setFinalizado] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const choferes = personas.filter(
    (p) => p.puesto === "CHOFER LARGA DISTANCIA" && p.estado
  );

  const choferesMov = personas.filter(
    (p) => p.puesto === "CHOFER MOVIMIENTO" && p.estado
  );

  const handleClickTramo = (newTramo) => {
    if (!newTramo.litros || !newTramo.lugar) return;
    setTramos([...tramos, newTramo]);
    setNuevoTramo({
      fecha: formatearFecha(new Date()),
      litros: 0,
      lugar: "",
    });
  };

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
        <form onSubmit={handleSubmit}>
          <label>Fecha</label>
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
                    setFormData({ ...formData, persona: opt ? opt.value : "" })
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
                    setFormData({ ...formData, persona: opt ? opt.value : "" })
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
                          tractores.find((t) => t.interno === formData.tractor)
                            ?.dominio + ` (${formData.tractor})`,
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
          <label>Tramos</label>
          <div className="form-box2">
            <div className="form-subbox">
              <input
                type="date"
                value={nuevoTramo.fecha}
                onChange={(t) =>
                  setNuevoTramo({ ...nuevoTramo, fecha: t.target.value })
                }
              />
              <input
                type="number"
                placeholder="Litros"
                value={nuevoTramo.litros}
                onChange={(t) =>
                  setNuevoTramo({ ...nuevoTramo, litros: t.target.value })
                }
              />
            </div>

            <div className="form-subbox">
              <Select
                className="select-grow"
                options={estaciones
                  .map((t) => ({
                    value: t.id,
                    label: `${t.localidad} (${t.provincia})`,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label))}
                value={
                  nuevoTramo.lugar
                    ? estaciones
                        .map((t) => ({
                          value: t.id,
                          label: `${t.localidad} (${t.provincia})`,
                        }))
                        .find((opt) => opt.value === nuevoTramo.lugar)
                    : null
                }
                onChange={(opt) =>
                  setNuevoTramo({ ...nuevoTramo, lugar: opt ? opt.value : "" })
                }
                placeholder="Lugar de carga"
              />
              <TextButton text="+" mini={true} onClick={handleClickTractor} />
            </div>
            <div className="form-subbox2">
              <TextButton
                text="+ Agregar tramo"
                mini={true}
                onClick={() => handleClickTramo(nuevoTramo)}
              />
            </div>
            {tramos.length > 0 && (
              <div className="form-itemlist">
                <div>
                  {[...tramos]
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                    .map((i, idx) => (
                      <p key={idx} className="form-table-item">
                        <span>{i.fecha}</span>
                        <span>
                          {estaciones.find((e) => e.id === i.lugar)?.localidad}{" "}
                          ({estaciones.find((e) => e.id === i.lugar)?.provincia}
                          )
                        </span>
                        <span>
                          <strong>{i.litros} lts</strong>
                        </span>
                        <span
                          onClick={() =>
                            setTramos(tramos.filter((_, j) => j !== idx))
                          }
                          className="delete-btn"
                        >
                          ✕
                        </span>
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
          <br />
          <label>Detalle</label>
          <textarea
            value={formData.detalle}
            onChange={(e) =>
              setFormData({ ...formData, detalle: e.target.value })
            }
          />
          <div className="form-buttons">
            <TextButton
              text={uploading ? "Guardando..." : "Guardar"}
              onClick={handleSubmit}
              type="submit"
              disabled={uploading}
            />
            <TextButton text="Cancelar" onClick={onClose} type="button" />
          </div>
        </form>
      </div>
    </div>
  );
}

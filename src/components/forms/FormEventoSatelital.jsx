// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";
import { agregarEvento } from "../../functions/eventFunctions";
import FormVehiculo from "./FormVehiculo";
import FormPersona from "./FormPersona";
import TextButton from "../buttons/TextButton";
import tiposEventos from "../../functions/data/eventos.json";
import InputValidator from "../devs/InputValidator";
import "./css/Forms.css";

const FormEventoSatelital = ({ evento = {}, onClose, onGuardar }) => {
  const area = "satelital";
  const { personas, tractores, furgones } = useData();
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [formData, setFormData] = useState({
    tipo: evento.tipo,
    fecha: formatearFecha(evento.fecha),
    hora: formatearHora(evento.fecha),
    persona: evento.persona ? String(evento.persona) : "",
    tractor: evento.tractor || "",
    furgon: evento.furgon || "",
    detalle: evento.detalle || "",
    area: area,
  });

  const subtiposDisponibles = area
    ? tiposEventos[area.toUpperCase()] || []
    : Object.entries(tiposEventos).flatMap(([nArea, subtipos]) =>
        subtipos.map((sub) => ({ nArea, subtipo: sub }))
      );

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fechaParaGuardar;

      if (evento.id) {
        if (evento.fecha.toDate) {
          fechaParaGuardar = evento.fecha.toDate();
        } else {
          fechaParaGuardar = new Date(evento.fecha);
        }
      } else {
        fechaParaGuardar = new Date();
      }

      if (isNaN(fechaParaGuardar.getTime())) {
        throw new Error("La fecha es inválida");
      }

      const datosAGuardar = {
        ...formData,
        fecha: evento.id ? evento.fecha : fechaParaGuardar,
        persona: formData.persona ? Number(formData.persona) : null,
        tractor: formData.tractor ? Number(formData.tractor) : null,
        furgon: formData.furgon ? Number(formData.furgon) : null,
        area: area,
        detalle: formData.detalle ? formData.detalle : null,
      };

      await agregarEvento(datosAGuardar, area, evento.id);

      if (onGuardar) onGuardar();
      Swal.fire({
        title: "Evento guardado",
        text: "Se ha completado el registro exitosamente.",
        icon: "succes",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      console.error("Error al guardar evento:", error);
    }
  };
  return (
    <div className="form">
      <div className="form-content">
        <div className="form-header">
          <h2>{evento.id ? "Editar Evento" : "Nuevo Evento"}</h2>
          <p>* campo obligatorio</p>
        </div>
        <hr />
        <div className="hora">
          <span>
            {evento.id ? formData.fecha : new Date().toLocaleDateString()}
          </span>
          <span>{evento.id ? formData.hora + " HS" : ""}</span>
        </div>
        <form onSubmit={handleSubmit} className="form-submit">
          <label>
            Tipo * <InputValidator campo={formData.tipo} />
            <Select
              options={subtiposDisponibles.map((sub) =>
                typeof sub === "string"
                  ? { value: sub, label: sub }
                  : { value: sub.tipo, label: sub.tipo }
              )}
              value={
                formData.tipo
                  ? { value: formData.tipo, label: formData.tipo }
                  : null
              }
              onChange={(opt) =>
                handleChange({
                  target: { name: "tipo", value: opt ? opt.value : "" },
                })
              }
              placeholder=""
              isClearable
              required
            />
          </label>
          <label>
            Persona / Empleado <InputValidator campo={formData.persona} />
            <div className="select-with-button">
              <Select
                className="select-grow"
                options={personas
                  .map((p) => ({
                    value: p.id,
                    label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
                    apellido: p.apellido, //para odenar
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
                required
              />
              <TextButton
                text="+"
                className="mini-btn"
                onClick={handleClickPersona}
              />
            </div>
          </label>

          <label>
            Tractor * <InputValidator campo={formData.tractor} />
            <div className="select-with-button">
              <Select
                className="select-grow"
                options={tractores
                  .map((t) => ({
                    value: t.interno,
                    label: `${t.dominio} (${t.interno})`,
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
              />
              <TextButton
                text="+"
                className="mini-btn"
                onClick={handleClickTractor}
              />
            </div>
          </label>

          <label>
            Carga / Furgón <InputValidator campo={formData.furgon} />
            <div className="select-with-button">
              <Select
                className="select-grow"
                options={furgones
                  .map((f) => ({
                    value: f.id,
                    label: `${f.dominio} (${f.interno ? f.interno : f.marca})`,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label))}
                value={
                  formData.furgon
                    ? (() => {
                        const seleccion = furgones.find(
                          (v) => v.id === formData.furgon
                        );
                        return seleccion
                          ? {
                              value: seleccion.id,
                              label: `${seleccion.dominio} (${
                                seleccion.interno
                                  ? seleccion.interno
                                  : seleccion.marca
                              })`,
                            }
                          : null;
                      })() // 👈 ejecutamos la función acá
                    : null
                }
                onChange={(opt) =>
                  setFormData({
                    ...formData,
                    furgon: opt ? opt.value : "",
                  })
                }
                placeholder="Seleccionar vehículo..."
                isClearable
              />

              <TextButton
                text="+"
                className="mini-btn"
                onClick={handleClickFurgon}
              />
            </div>
          </label>

          <label>
            Detalle <InputValidator campo={formData.detalle} />
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
            />
          </label>

          <div className="form-data">
            {evento.usuario ? (
              <p>
                Cargado por <strong>{evento.usuario}</strong>{" "}
                <InputValidator campo={evento.usuario} />
              </p>
            ) : (
              " "
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={uploading}>
              {uploading ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
      {modalTractorVisible && (
        <FormVehiculo
          tipoVehiculo={"tractores"}
          onClose={cerrarModalTractor}
          onGuardar={cerrarModalTractor}
        />
      )}
      {modalFurgonVisible && (
        <FormVehiculo
          tipoVehiculo={"furgones"}
          onClose={cerrarModalFurgon}
          onGuardar={cerrarModalFurgon}
        />
      )}
      {modalVehiculoVisible && (
        <FormVehiculo
          tipoVehiculo={"vehiculos"}
          onClose={cerrarModalVehiculo}
          onGuardar={cerrarModalVehiculo}
        />
      )}
      {modalPersonaVisible && (
        <FormPersona
          onClose={cerrarModalPersona}
          onGuardar={cerrarModalPersona}
        />
      )}
    </div>
  );
};

export default FormEventoSatelital;

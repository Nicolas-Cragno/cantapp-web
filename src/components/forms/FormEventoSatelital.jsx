// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";
import { agregarEvento } from "../../functions/eventFunctions";
import tiposEventos from "../../functions/data/eventos.json";
import InputValidator from "../devs/InputValidator";
import "./css/Forms.css";

const FormEventoSatelital = ({ evento = {}, onClose, onGuardar }) => {
  const area = "satelital";
  const { personas, tractores, furgones } = useData();
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
            Tipo* <InputValidator campo={formData.tipo} />
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value=""></option>
              {subtiposDisponibles.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Persona / Empleado <InputValidator campo={formData.persona} />
            <select
              name="persona"
              value={formData.persona}
              onChange={handleChange}
              //required
            >
              <option value=""></option>
              {personas.map((p) => (
                <option key={p.dni} value={p.dni}>
                  {p.apellido} {p.nombres} (DNI: {p.dni})
                </option>
              ))}
            </select>
          </label>

          <label>
            Tractor <InputValidator campo={formData.tractor} />
            <select
              type="number"
              name="tractor"
              value={formData.tractor}
              onChange={handleChange}
            >
              <option value=""></option>
              {tractores.map((t) => (
                <option key={t.interno} value={t.interno}>
                  {t.dominio} ({t.interno})
                </option>
              ))}
            </select>
          </label>

          <label>
            Furgón <InputValidator campo={formData.furgon} />
            <select
              type="number"
              name="furgon"
              value={formData.furgon}
              onChange={handleChange}
            >
              <option value=""></option>
              {furgones.map((f) => (
                <option key={f.interno} value={f.interno}>
                  {f.dominio} ({f.interno})
                </option>
              ))}
            </select>
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
    </div>
  );
};

export default FormEventoSatelital;

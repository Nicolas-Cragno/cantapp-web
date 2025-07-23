import { useState, useEffect } from "react";
import "../css/Forms.css";
import { agregar } from "../../functions/db-functions";
import { formatearFechaInput } from "../../functions/data-functions"; // deberías tener esto para adaptar a yyyy-mm-dd

const FormularioEvento = ({ evento = {}, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    fecha: evento.fecha ? formatearFechaInput(evento.fecha) : "",
    subtipo: evento.subtipo || "",
    persona: evento.persona || "",
    tractor: evento.tractor || "",
    furgon: evento.furgon || "",
    detalle: evento.detalle || "",
    area: evento.area || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const datosAGuardar = {
        ...formData,
        fecha: new Date(formData.fecha),
      };

      if (evento.id) {
        await agregar("eventos", evento.id, datosAGuardar);
      } else {
        await agregar("eventos", null, datosAGuardar); // nuevo
      }

      if (onGuardar) onGuardar();
    } catch (error) {
      console.error("Error al guardar evento:", error);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{evento.id ? "Editar Evento" : "Nuevo Evento"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Fecha:
            <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
          </label>

          <label>
            Subtipo:
            <input type="text" name="subtipo" value={formData.subtipo} onChange={handleChange} required />
          </label>

          <label>
            Persona (DNI):
            <input type="text" name="persona" value={formData.persona} onChange={handleChange} />
          </label>

          <label>
            Tractor:
            <input type="text" name="tractor" value={formData.tractor} onChange={handleChange} />
          </label>

          <label>
            Furgón:
            <input type="text" name="furgon" value={formData.furgon} onChange={handleChange} />
          </label>

          <label>
            Detalle:
            <textarea name="detalle" value={formData.detalle} onChange={handleChange} />
          </label>

          <label>
            Área:
            <input type="text" name="area" value={formData.area} onChange={handleChange} />
          </label>

          <div className="form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEvento;

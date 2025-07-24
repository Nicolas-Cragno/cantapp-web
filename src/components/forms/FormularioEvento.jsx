import { useState, useEffect } from "react";
import "../css/Forms.css";
import { agregarEvento, listarColeccion } from "../../functions/db-functions";
import { formatearFechaHoraInput } from "../../functions/data-functions"; // la función que formatea fecha+hora

const FormularioEvento = ({ evento = {}, onClose, onGuardar }) => {
  // Fecha inicial: si viene, convertí a Date, sino ahora con hora
  const fechaInicial = evento.fecha
    ? (typeof evento.fecha.toDate === "function" ? evento.fecha.toDate() : new Date(evento.fecha))
    : new Date();

  const [formData, setFormData] = useState({
    fecha: formatearFechaHoraInput(fechaInicial),
    subtipo: evento.subtipo || "",
    persona: evento.persona ? String(evento.persona) : "",
    tractor: evento.tractor || "",
    furgon: evento.furgon || "",
    detalle: evento.detalle || "",
    area: evento.area || "",
  });

  const [personas, setPersonas] = useState([]);
  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        const data = await listarColeccion("personas");
        setPersonas(data);
      } catch (error) {
        console.error("Error cargando personas:", error);
      }
    };

    const cargarSectores = async () => {
      try {
        const data = await listarColeccion("sectores");
        setSectores(data);
      } catch (error) {
        console.error("Error cargando sectores:", error);
      }
    };

    cargarPersonas();
    cargarSectores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // La fecha guardada debe ser la original (Date) cuando edito, o la fecha actual (Date) si es nuevo
      const fechaParaGuardar = evento.fecha
        ? (typeof evento.fecha.toDate === "function" ? evento.fecha.toDate() : new Date(evento.fecha))
        : new Date();

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        persona: formData.persona ? Number(formData.persona) : null,
        tractor: formData.tractor ? Number(formData.tractor) : null,
        furgon: formData.furgon ? Number(formData.furgon) : null,
      };

      if (evento.id) {
        await agregarEvento(datosAGuardar, evento.id);
      } else {
        await agregarEvento(datosAGuardar);
      }

      if (onGuardar) onGuardar();
      alert("Evento guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar evento:", error);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <div className="form-header">
          <h2>{evento.id ? "Editar Evento" : "Nuevo Evento"}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Fecha y hora - solo lectura */}
          <label>
            Fecha y hora:
            <input
              type="text"
              name="fecha"
              value={formData.fecha}
              readOnly
              disabled
            />
          </label>

          <label>
            Subtipo:
            <input
              type="text"
              name="subtipo"
              value={formData.subtipo}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Persona:
            <select
              name="persona"
              value={formData.persona}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una persona</option>
              {personas.map((p) => (
                <option key={p.dni} value={p.dni}>
                  {p.apellido} {p.nombres} (DNI: {p.dni})
                </option>
              ))}
            </select>
          </label>

          <label>
            Tractor:
            <input
              type="number"
              name="tractor"
              value={formData.tractor}
              onChange={handleChange}
            />
          </label>

          <label>
            Furgón:
            <input
              type="number"
              name="furgon"
              value={formData.furgon}
              onChange={handleChange}
            />
          </label>

          <label>
            Área:
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un sector</option>
              {sectores.map((s) => (
                <option key={s.id || s.nombre} value={s.nombre}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Detalle:
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
            />
          </label>

          <div className="form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEvento;

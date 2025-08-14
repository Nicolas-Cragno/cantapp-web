import { useState, useEffect } from "react";
import "../css/Forms.css";
import { agregarEvento, listarColeccion } from "../../functions/db-functions";
import Swal from "sweetalert2";
import { formatearFecha, formatearHora } from "../../functions/data-functions"; // la función que formatea fecha+hora
import tiposEventos from "../../functions/data/eventos.json";

const FormularioLlavePorteria = ({ evento = {}, onClose, onGuardar }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fecha: formatearFecha(evento.fecha) + " " + formatearHora(evento.fecha),
    subtipo: evento.subtipo || "",
    persona: evento.persona ? String(evento.persona) : "",
    tractor: evento.tractor || "",
    detalle: evento.detalle || "",
  });

  const [personas, setPersonas] = useState([]);
  const [operadores, setOperadores] = useState([]); // empleados de seguridad
  const [tractores, setTractores] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const fechaEvento = evento.fecha
        ? formatearFecha(evento.fecha) + " " + formatearHora(evento.fecha)
        : formatearFecha(new Date()) + " " + formatearHora(new Date());

      setFormData({
        fecha: fechaEvento,
        subtipo: evento.subtipo || "",
        persona: evento.persona ? String(evento.persona) : "",
        tractor: evento.tractor || "",
        detalle: evento.detalle || "",
      });
      const cargarPersonas = async () => {
        try {
          const data = await listarColeccion("personas");
          const dataFiltrada = data.filter(
            (p) =>
              p.puesto === "CHOFER LARGA DISTANCIA" ||
              p.puesto === "CHOFER MOVIMIENTO"
          );
          setPersonas(dataFiltrada);
        } catch (error) {
          console.error("Error cargando personas:", error);
        }
      };
      const cargarOperadores = async () => {
        try {
          const data = await listarColeccion("personas");
          const dataFiltrada = data.filter(
            (p) => p.puesto === "VIGILANCIA" || p.puesto === "SEGURIDAD"
          );
          setOperadores(dataFiltrada);
        } catch (error) {
          console.error("Error cargando operadores: ", error);
        }
      };
      const cargarTractores = async () => {
        try {
          const data = await listarColeccion("tractores");
          setTractores(data);
        } catch (error) {
          console.error("Error al cargar tractores: ", error);
        }
      };
      cargarPersonas();
      cargarTractores();
      cargarOperadores();
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let fechaParaGuardar;

      if (evento.id) {
        // evento.fecha es un Timestamp de Firebase
        if (evento.fecha.toDate) {
          fechaParaGuardar = evento.fecha.toDate(); // ✅ convierte a Date
        } else {
          fechaParaGuardar = new Date(evento.fecha); // por si ya era Date
        }
      } else {
        fechaParaGuardar = new Date(); // fecha nueva
      }
      const usuarioParaGuardar = localStorage.usuario
        ? JSON.parse(localStorage.usuario)
        : null;

      if (isNaN(new Date(fechaParaGuardar).getTime())) {
        throw new Error("La fecha es inválida");
      }

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        persona: formData.persona ? Number(formData.persona) : null,
        tractor: formData.tractor ? Number(formData.tractor) : null,
        area: formData.area ? formData.area : "PORTERIA",
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,
        usuario: usuarioParaGuardar
          ? `${usuarioParaGuardar.apellido} ${usuarioParaGuardar.nombres}`
          : "Desconocido",
      };

      if (evento.id) {
        await agregarEvento(datosAGuardar, evento.id);
      } else {
        await agregarEvento(datosAGuardar);
      }

      if (onGuardar) onGuardar();
      Swal.fire({
        title: "Evento guardado",
        text: "Se ha completado el registro exitosamente.",
        icon: "success",
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
          <h2>Registro de llaves</h2>
          <p>* campo obligatorio</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Tipo *
            <select
              name="subtipo"
              value={formData.subtipo}
              onChange={handleChange}
              required
            >
              <option key="" value=""></option>
              <option key="1" value="Deja llaver">
                DEJA
              </option>
              <option key="2" value="Retira llaves">
                RETIRA
              </option>
            </select>
          </label>

          <label>
            Chofer
            <select
              name="persona"
              value={formData.persona}
              onChange={handleChange}
              required
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
            Recibe / entrega
            <select
              name="persona"
              value={formData.operador}
              onChange={handleChange}
              required
            >
              <option value=""></option>
              {operadores.map((o) => (
                <option key={o.dni} value={o.dni}>
                  {o.apellido} {o.nombres} (DNI: {o.dni})
                </option>
              ))}
            </select>
          </label>

          <label>
            Tractor
            <select
              type="number"
              name="tractor"
              value={formData.tractor}
              onChange={handleChange}
              required
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
            Detalle
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

export default FormularioLlavePorteria;

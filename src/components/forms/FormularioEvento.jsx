import { useState, useEffect } from "react";
import "../css/Forms.css";
import { agregarEvento, listarColeccion } from "../../functions/db-functions";
import Swal from "sweetalert2";
import {
  formatearFecha,
  formatearFechaHoraInput,
  formatearHora,
} from "../../functions/data-functions"; // la función que formatea fecha+hora
import tiposEventos from "../../functions/data/eventos.json";

const FormularioEvento = ({
  evento = {},
  area = null,
  subarea = null,
  onClose,
  onGuardar,
}) => {
  const [formData, setFormData] = useState({
    fecha: formatearFecha(evento.fecha),
    hora: formatearHora(evento.fecha),
    subtipo: evento.subtipo || "",
    persona: evento.persona ? String(evento.persona) : "",
    tractor: evento.tractor || "",
    furgon: evento.furgon || "",
    detalle: evento.detalle || "",
    area: evento.area || area || "",
  });

  const subtiposDisponibles = area
    ? tiposEventos[area] || []
    : Object.entries(tiposEventos).flatMap(([area, subtipos]) =>
        subtipos.map((sub) => ({ area, subtipo: sub }))
      );

  const [personas, setPersonas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [tractores, setTractores] = useState([]);
  const [furgones, setFurgones] = useState([]);

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

    const cargarTractores = async () => {
      try {
        const data = await listarColeccion("tractores");
        setTractores(data);
      } catch (error) {
        console.error("Error al cargar tractores: ", error);
      }
    };

    const cargarFurgones = async () => {
      try {
        const data = await listarColeccion("furgones");
        setFurgones(data);
      } catch (error) {
        console.error("Error al cargar furgones:", error);
      }
    };

    cargarPersonas();
    cargarSectores();
    cargarTractores();
    cargarFurgones();
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

      if (isNaN(fechaParaGuardar.getTime())) {
        throw new Error("La fecha es inválida");
      }

      const usuarioJSON = JSON.parse(localStorage.usuario);
      const usuarioDeCarga =
        usuarioJSON["apellido"] + " " + usuarioJSON["nombres"];

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        subtipo: formData.subtipo ? formData.subtipo.toUpperCase() : null,
        persona: formData.persona ? Number(formData.persona) : null,
        tractor: formData.tractor ? Number(formData.tractor) : null,
        furgon: formData.furgon ? Number(formData.furgon) : null,
        area: area ? area : null, //El area la recibe desde la tabla/ficha
        detalle: formData.area ? formData.detalle.toUpperCase() : null,
        usuario: evento.id
          ? evento.usuario
            ? evento.usuario
            : usuarioDeCarga
          : null,
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
            Tipo *
            <input
              list="subtipos-list"
              name="subtipo"
              value={formData.subtipo}
              onChange={handleChange}
              required
            />
            <datalist id="subtipos-list">
              {typeof subtiposDisponibles[0] === "string"
                ? subtiposDisponibles.map((sub, i) => (
                    <option key={i} value={sub} />
                  ))
                : subtiposDisponibles.map((item, i) => (
                    <option key={i} value={`${item.area} - ${item.subtipo}`} />
                  ))}
            </datalist>
          </label>

          <label>
            Persona / Empleado
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
            Tractor
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
            Furgón
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
            Detalle
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
              </p>
            ) : (
              " "
            )}
          </div>

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

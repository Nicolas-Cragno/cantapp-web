import { useState, useEffect } from "react";
import "./css/Forms.css";
import { agregarEvento, listarColeccion } from "../../functions/db-functions";
import chequeosPorteria from "../../functions/data/chequeosPorteria.json";
import Swal from "sweetalert2";
import {
  formatearFecha,
  formatearFechaHoraInput,
  formatearHora,
} from "../../functions/data-functions"; // la función que formatea fecha+hora
import tiposEventos from "../../functions/data/eventos.json";

const FormularioEventoPorteria = ({
  evento = {},
  area = null,
  tipoPorArea = null,
  onClose,
  onGuardar,
}) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fecha: formatearFecha(evento.fecha) + " " + formatearHora(evento.fecha),
    subtipo: evento.subtipo || "",
    persona: evento.persona ? String(evento.persona) : "",
    tractor: evento.tractor || "",
    furgon: evento.furgon || "",
    detalle: evento.detalle || "",
    area: evento.area || area || "",
    chequeos: chequeosPorteria.map(
      ({ key }) => evento?.chequeos?.[key] || false
    ),
  });

  const subtiposDisponibles = (() => {
    if (tipoPorArea && tiposEventos[tipoPorArea]) {
      return tiposEventos[tipoPorArea].map((subtipo) => ({
        area: tipoPorArea,
        subtipo,
      }));
    } else if (formData.area && tiposEventos[formData.area]) {
      return tiposEventos[formData.area].map((subtipo) => ({
        area: formData.area,
        subtipo,
      }));
    } else {
      return [{ area: "GENERAL", subtipo: "OTRO" }];
    }
  })();
  const [personas, setPersonas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [tractores, setTractores] = useState([]);
  const [furgones, setFurgones] = useState([]);

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
        furgon: evento.furgon || "",
        detalle: evento.detalle || "",
        area: evento.area || area || "",
        chequeos: chequeosPorteria.map(({ key }) => {
          const valor = evento?.chequeos?.[key];
          return typeof valor === "boolean" ? valor : false;
        }),
      });
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

      const chequeosObjeto = chequeosPorteria.reduce(
        (checkList, item, index) => {
          checkList[item.key] = formData.chequeos[index] || false;
          return checkList;
        },
        {}
      );

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        persona: formData.persona ? Number(formData.persona) : null,
        tractor: formData.tractor ? Number(formData.tractor) : null,
        furgon: formData.furgon ? Number(formData.furgon) : null,
        area: formData.area ? formData.area : null,
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,
        usuario: usuarioParaGuardar
          ? `${usuarioParaGuardar.apellido} ${usuarioParaGuardar.nombres}`
          : "Desconocido",
        chequeos: chequeosObjeto,
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
          <h2>
            {evento.id
              ? "Editar " + evento.subtipo.toLowerCase()
              : "Nuevo Evento"}
          </h2>
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
              <option value="">Seleccione subtipo</option>
              {typeof subtiposDisponibles[0] === "string"
                ? subtiposDisponibles.map((sub, i) => (
                    <option key={i} value={sub}>
                      {sub}
                    </option>
                  ))
                : subtiposDisponibles.map((item, i) => (
                    <option key={i} value={item.subtipo}>
                      {item.subtipo}
                    </option>
                  ))}
            </select>
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
          <div>
            <label>Chequeos</label>
            <div className="checkbox-list">
              {chequeosPorteria.map((nombre, i) => (
                <label
                  key={i}
                  className={`item-check ${
                    formData.chequeos[i] ? "activo" : "inactivo"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.chequeos[i]}
                    onChange={(e) => {
                      const nuevasMarcas = [...formData.chequeos];
                      nuevasMarcas[i] = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        chequeos: nuevasMarcas,
                      }));
                    }}
                  />
                  {nombre.label}
                </label>
              ))}
            </div>
          </div>

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

export default FormularioEventoPorteria;

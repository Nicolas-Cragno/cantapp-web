import { useState, useEffect } from "react";
import "../css/Forms.css";
import { agregarEvento, listarColeccion } from "../../functions/db-functions";
import { formatearFechaHoraInput } from "../../functions/data-functions"; // la función que formatea fecha+hora
import tiposEventos from "../../functions/data/eventos.json";

const FormularioEvento = ({ evento = {}, area=null, tipoPorArea = null, onClose, onGuardar }) => {
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
    area: evento.area || area || "",
  });

  const subtiposDisponibles = tipoPorArea ? tiposEventos[tipoPorArea] || [] : Object.entries(tiposEventos).flatMap(
  ([area, subtipos]) => subtipos.map((sub) => ({ area, subtipo: sub })));

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
      try{
        const data = await listarColeccion("tractores");
        setTractores(data);
      } catch(error){
        console.error("Error al cargar tractores: ", error);
      }
    }

    const cargarFurgones = async () => {
      try{
        const data = await listarColeccion("furgones");
        setFurgones(data);
      } catch (error){
        console.error("Error al cargar furgones:", error);
      }
    }

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
    const fechaParaGuardar = formData.fecha
      ? new Date(formData.fecha)
      : new Date();

    if (isNaN(fechaParaGuardar.getTime())) {
      throw new Error("La fecha es inválida");
    }

    const datosAGuardar = {
      ...formData,
      fecha: fechaParaGuardar,
      persona: formData.persona ? Number(formData.persona) : null,
      tractor: formData.tractor ? Number(formData.tractor) : null,
      furgon: formData.furgon ? Number(formData.furgon) : null,
      area: formData.area ? formData.area : null,
      detalle: formData.area ? formData.detalle.toUpperCase() : null,
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
    alert(`Error al guardar evento: ${error.message}`);
  }
  };
  return (
    <div className="form">
      <div className="form-content">
        <div className="form-header">
          <h2>{evento.id ? "Editar Evento" : "Nuevo Evento"}</h2>
          <p>* campo obligatorio</p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Fecha y hora - solo lectura */}
          <label>
            Fecha y hora
            <input
              type="text"
              name="fecha"
              value={formData.fecha}
              readOnly
              disabled
            />
          </label>

          <label>
            Tipo *
            <select
              name="subtipo"
              value={formData.subtipo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione subtipo</option>

              {/* Si es un array de strings */}
              {typeof subtiposDisponibles[0] === "string"
                ? subtiposDisponibles.map((sub, i) => (
                    <option key={i} value={sub}>
                      {sub}
                    </option>
                  ))
                : subtiposDisponibles.map((item, i) => (
                    <option key={i} value={item.subtipo}>
                      {item.area} - {item.subtipo}
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

          <label>
            Sector:
            {area ? (
              <input
                type="text"
                name="area"
                value={formData.area}
                readOnly
                disabled
              />
            ) : (
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                {sectores.map((s) => (
                  <option key={s.id || s.nombre} value={s.nombre}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            )}
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

export default FormularioEvento;

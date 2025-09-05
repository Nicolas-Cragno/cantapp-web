import { useState, useEffect } from "react";
import Select from "react-select";
import "./css/Forms.css";
import { listarColeccion } from "../../functions/db-functions";
import { agregarEvento } from "../../functions/event-functions";
import Swal from "sweetalert2";
import { formatearFecha, formatearHora } from "../../functions/data-functions"; // la función que formatea fecha+hora
import tiposEventos from "../../functions/data/eventos.json";

const FormularioLlavePorteria = ({ evento = {}, onClose, onGuardar }) => {
  const area = "porteria";
  const subarea = "llaveporteria"; // para listar tipos de eventos únicament
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tipo: evento.tipo || "",
    persona: evento.persona ? String(evento.persona) : "",
    operador: evento.operador ? String(evento.operador) : "",
    tractor: evento.tractor || "",
    detalle: evento.detalle || "",
  });

  const subtiposDisponibles = subarea
    ? tiposEventos[subarea.toUpperCase()] || []
    : Object.entries(tiposEventos).flatMap(([nArea, subtipos]) =>
        subtipos.map((sub) => ({ nArea, subtipo: sub }))
      );

  const [personas, setPersonas] = useState([]);
  const [operadores, setOperadores] = useState([]); // empleados de seguridad
  const [tractores, setTractores] = useState([]);
  const [multiTractor, setMultiTractor] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const fechaEvento = evento.fecha
        ? formatearFecha(evento.fecha) + " " + formatearHora(evento.fecha)
        : formatearFecha(new Date()) + " " + formatearHora(new Date());

      setFormData({
        fecha: fechaEvento,
        tipo: evento.tipo || "",
        persona: evento.persona ? String(evento.persona) : "",
        operador: evento.operador ? String(evento.operador) : "",
        tractor: evento.tractor
          ? Array.isArray(evento.tractor)
            ? evento.tractor
            : [evento.tractor]
          : [],
        detalle: evento.detalle || "",
      });
      const cargarPersonas = async () => {
        try {
          const data = await listarColeccion("personas");
          const dataFiltrada = data
            /*
            .filter(
              (p) =>
                p.puesto === "CHOFER LARGA DISTANCIA" ||
                p.puesto === "CHOFER MOVIMIENTO"
            )
            */
            .sort((a, b) => a.apellido.localeCompare(b.apellido));
          setPersonas(dataFiltrada);
        } catch (error) {
          console.error("Error cargando personas:", error);
        }
      };
      const cargarOperadores = async () => {
        try {
          const data = await listarColeccion("personas");
          const dataFiltrada = data
            .filter(
              (p) => p.puesto === "VIGILANCIA" || p.puesto === "SEGURIDAD"
            )
            .sort((a, b) => a.apellido.localeCompare(b.apellido));
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
      if (evento?.id && evento.fecha) {
        fechaParaGuardar = evento.fecha.toDate
          ? evento.fecha.toDate()
          : new Date(evento.fecha);
      } else {
        fechaParaGuardar = new Date();
      }

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        tipo: formData.tipo ? formData.tipo.toUpperCase() : null,
        persona: formData.persona ? Number(formData.persona) : null,
        operador: formData.operador ? Number(formData.operador) : null,
        tractor: formData.tractor ? formData.tractor.map(Number) : [], // array de internos
        area: formData.area ? formData.area : area,
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,
      };

      await agregarEvento(datosAGuardar, area, evento.id);

      if (onGuardar) onGuardar();
      Swal.fire({
        title: "Evento guardado",
        text: "Se ha completado el registro exitosamente.",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      onClose();
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
          <h2>{evento.id ? evento.id : "REGISTRO DE LLAVES"}</h2>
          <p>* campo obligatorio</p>
          <hr />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tipo */}
          <label>
            Tipo *
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

          {/* Chofer */}
          <label>
            Chofer *
            <Select
              options={personas.map((p) => ({
                value: p.dni,
                label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
              }))}
              value={
                formData.persona
                  ? personas
                      .map((p) => ({
                        value: p.dni,
                        label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
                      }))
                      .find((opt) => opt.value === formData.persona)
                  : null
              }
              onChange={(opt) =>
                handleChange({
                  target: { name: "persona", value: opt ? opt.value : "" },
                })
              }
              placeholder=""
              isClearable
              required
            />
          </label>

          {/* Operador */}
          <label>
            Operador *
            <Select
              options={operadores.map((o) => ({
                value: o.dni,
                label: `${o.apellido} ${o.nombres} (DNI: ${o.dni})`,
              }))}
              value={
                formData.operador
                  ? operadores
                      .map((o) => ({
                        value: o.dni,
                        label: `${o.apellido} ${o.nombres} (DNI: ${o.dni})`,
                      }))
                      .find((opt) => opt.value === formData.operador)
                  : null
              }
              onChange={(opt) =>
                handleChange({
                  target: { name: "operador", value: opt ? opt.value : "" },
                })
              }
              placeholder=""
              isClearable
              required
            />
          </label>

          {/* Tractor */}
          <label>
            Tractor *
            <Select
              options={tractores.map((t) => ({
                value: t.interno,
                label: `${t.interno} (${t.dominio})`,
              }))}
              value={tractores
                .map((t) => ({
                  value: t.interno,
                  label: `${t.interno} (${t.dominio})`,
                }))
                .filter((opt) => formData.tractor.includes(opt.value))}
              onChange={(opts) =>
                handleChange({
                  target: {
                    name: "tractor",
                    value: opts ? opts.map((o) => o.value) : [],
                  },
                })
              }
              placeholder=""
              isClearable
              isMulti
              required
            />
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

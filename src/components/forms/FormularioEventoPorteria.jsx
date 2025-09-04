import { useState, useEffect } from "react";
import Select from "react-select";
import "./css/Forms.css";
import { listarColeccion } from "../../functions/db-functions";
import { agregarEvento } from "../../functions/event-functions";
import chequeosPorteria from "../../functions/data/chequeosPorteria.json";
import Swal from "sweetalert2";
import { formatearFecha, formatearHora } from "../../functions/data-functions"; // la función que formatea fecha+hora
import tiposEventos from "../../functions/data/eventos.json";

const FormularioEventoPorteria = ({ evento = {}, onClose, onGuardar }) => {
  const area = "porteria";

  const [formData, setFormData] = useState({
    tipo: evento.tipo || "",
    persona: evento.persona ? String(evento.persona) : "",
    operador: evento.operador ? String(evento.operador) : "",
    tractor: evento.tractor || "",
    furgon: evento.furgon || "",
    detalle: evento.detalle || "",
    area: area,
    chequeos: chequeosPorteria.map(
      ({ key }) => evento?.chequeos?.[key] || false
    ),
  });

  const subtiposDisponibles = area
    ? tiposEventos[area.toUpperCase()] || []
    : Object.entries(tiposEventos).flatMap(([nArea, subtipos]) =>
        subtipos.map((sub) => ({ nArea, subtipo: sub }))
      );

  const [personas, setPersonas] = useState([]);
  const [tractores, setTractores] = useState([]);
  const [furgones, setFurgones] = useState([]);
  const [operadores, setOperadores] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      setFormData({
        tipo: evento.tipo || "",
        persona: evento.persona ? String(evento.persona) : "",
        tractor: evento.tractor || "",
        furgon: evento.furgon || "",
        detalle: evento.detalle || "",
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

      const cargarFurgones = async () => {
        try {
          const data = await listarColeccion("furgones");
          setFurgones(data);
        } catch (error) {
          console.error("Error al cargar furgones:", error);
        }
      };

      cargarPersonas();
      cargarOperadores();
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
      if (evento?.id && evento.fecha) {
        fechaParaGuardar = evento.fecha.toDate
          ? evento.fecha.toDate()
          : new Date(evento.fecha);
      } else {
        fechaParaGuardar = new Date();
      }

      /*
      if (isNaN(fechaParaGuardar.getTime())) {
        throw new Error("La fecha es inválida");
      }
     */

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
        tipo: formData.tipo || null,
        persona: formData.persona ? Number(formData.persona) : null,
        operador: formData.operador ? Number(formData.operador) : null,
        tractor: formData.tractor ? Number(formData.tractor) : null,
        furgon: formData.furgon ? Number(formData.furgon) : null,
        area: area,
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,
        chequeos: chequeosObjeto,
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
          <h2>{evento.id ? evento.id : "Nuevo Evento"}</h2>
          <p>* campo obligatorio</p>
          <hr />
        </div>
        <form onSubmit={handleSubmit}>
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
                  ? {
                      value: formData.tipo,
                      label: formData.tipo,
                    }
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
            Chofer
            <Select
              options={personas.map((p) => ({
                value: p.dni,
                label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
              }))}
              onChange={(opt) =>
                setFormData({ ...formData, persona: opt.value })
              }
              placeholder=""
              isClearable
              required
            />
          </label>

          <label>
            Tractor
            <Select
              options={tractores.map((t) => ({
                value: t.interno,
                label: `${t.dominio} (${t.interno})`,
              }))}
              onChange={(opt) =>
                setFormData({ ...formData, tractor: opt.value })
              }
              placeholder=""
              isClearable
              required
            />
          </label>

          <label>
            Furgón
            <Select
              options={furgones.map((f) => ({
                value: f.interno,
                label: `${f.dominio} (${f.interno})`,
              }))}
              onChange={(opt) =>
                setFormData({ ...formData, furgon: opt.value })
              }
              placeholder=""
              isClearable
              required
            />
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
            Operador
            <Select
              options={operadores.map((o) => ({
                value: o.dni,
                label: `${o.apellido} ${o.nombres} (DNI: ${o.dni})`,
              }))}
              onChange={(opt) =>
                setFormData({ ...formData, operador: opt.value })
              }
              placeholder=""
              isClearable
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

export default FormularioEventoPorteria;

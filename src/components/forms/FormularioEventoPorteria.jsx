// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { FaCheck as OkLogo } from "react-icons/fa";
import { GiCancel as XLogo } from "react-icons/gi";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { agregarEvento } from "../../functions/eventFunctions";
import { agregarItem, quitarItem } from "../../functions/stockFunctions";

// ----------------------------------------------------------------------- json e info
import chequeosPorteria from "../../functions/data/chequeosPorteria.json";
import tiposEventos from "../../functions/data/eventos.json";

// ----------------------------------------------------------------------- visuales, logos, etc
import TextButton from "../buttons/TextButton";
import "./css/Forms.css";

const FormularioEventoPorteria = ({ elemento = {}, onClose, onGuardar }) => {
  const SUCURSAL = "01";
  const area = "porteria";
  const { personas, tractores, furgones } = useData();

  const [formData, setFormData] = useState({
    tipo: elemento.tipo || "",
    persona: elemento.persona ? String(elemento.persona) : "",
    operador: elemento.operador ? String(elemento.operador) : "",
    tractor: elemento.tractor || "",
    furgon: elemento.furgon || "",
    cargado: elemento.cargado || false,
    detalle: elemento.detalle || "",
    area: area,
    chequeos: chequeosPorteria.map(
      ({ key }) => elemento?.chequeos?.[key] || false
    ),
  });

  const subtiposDisponibles = area
    ? tiposEventos[area.toUpperCase()] || []
    : Object.entries(tiposEventos).flatMap(([nArea, subtipos]) =>
        subtipos.map((sub) => ({ nArea, subtipo: sub }))
      );
  const [furgonCargado, setFuegonCargado] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setFormData({
        tipo: elemento.tipo || "",
        persona: elemento.persona ? String(elemento.persona) : "",
        tractor: elemento.tractor || "",
        furgon: elemento.furgon || "",
        cargado: elemento.cargado || false,
        detalle: elemento.detalle || "",
        chequeos: chequeosPorteria.map(({ key }) => {
          const valor = elemento?.chequeos?.[key];
          return typeof valor === "boolean" ? valor : false;
        }),
      });
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCarga = (state) => {
    if (state) {
      setFuegonCargado(true);
    } else {
      setFuegonCargado(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true); // para evitar doble carga/duplicados

    try {
      let fechaParaGuardar;
      if (elemento?.id && elemento.fecha) {
        fechaParaGuardar = elemento.fecha.toDate
          ? elemento.fecha.toDate()
          : new Date(elemento.fecha);
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

      if (
        !formData.tipo ||
        !formData.persona ||
        !formData.operador ||
        !formData.tractor
      ) {
        Swal.fire({
          title: "Atención",
          text: "Debes seleccionar un tipo de evento antes de guardar.",
          icon: "warning",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#4161bd",
        });
        setUploading(false);
        return;
      }

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        tipo: formData.tipo || null,
        persona: formData.persona ? Number(formData.persona) : null,
        operador: formData.operador ? Number(formData.operador) : null,
        tractor: formData.tractor ? Number(formData.tractor) : null,
        furgon: formData.furgon ? Number(formData.furgon) : null,
        cargado: furgonCargado,
        area: area,
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,
        chequeos: chequeosObjeto,
      };

      await agregarEvento(datosAGuardar, area, elemento.id);
      if (datosAGuardar.tipo === "ENTRADA") {
        agregarItem(SUCURSAL, "tractores", datosAGuardar.tractor);
        if (datosAGuardar.furgon) {
          agregarItem(SUCURSAL, "furgones", datosAGuardar.furgon);
        }
      } else if (datosAGuardar.tipo === "SALIDA") {
        quitarItem(SUCURSAL, "tractores", datosAGuardar.tractor);
        if (datosAGuardar.furgon) {
          quitarItem(SUCURSAL, "furgones", datosAGuardar.furgon);
        }
      }

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
          <h2>{elemento.id ? elemento.id : "Nuevo Evento"}</h2>
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
            Chofer *
            <Select
              options={personas.map((p) => ({
                value: p.id,
                label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
              }))}
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
          </label>

          <label>
            Operador *
            <Select
              options={personas
                .filter(
                  (o) => o.puesto === "VIGILANCIA" || o.puesto === "SEGURIDAD"
                )
                .map((o) => ({
                  value: o.id,
                  label: `${o.apellido} ${o.nombres} (DNI: ${o.dni})`,
                }))}
              value={
                formData.operador
                  ? {
                      value: formData.operador,
                      label:
                        personas.find((o) => o.id === formData.operador)
                          ?.apellido +
                        " " +
                        personas.find((o) => o.id === formData.operador)
                          ?.nombres +
                        ` (DNI: ${formData.operador})`,
                    }
                  : null
              }
              onChange={(opt) =>
                setFormData({ ...formData, operador: opt ? opt.value : "" })
              }
              placeholder=""
              isClearable
              required
            />
          </label>

          <label>
            Tractor *
            <Select
              options={tractores.map((t) => ({
                value: t.interno,
                label: `${t.dominio} (${t.interno})`,
              }))}
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
                setFormData({ ...formData, tractor: opt ? opt.value : "" })
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
              value={
                formData.furgon
                  ? {
                      value: formData.furgon,
                      label:
                        furgones.find((f) => f.interno === formData.furgon)
                          ?.dominio + ` (${formData.furgon})`,
                    }
                  : null
              }
              onChange={(opt) =>
                setFormData({ ...formData, furgon: opt ? opt.value : "" })
              }
              placeholder=""
              isClearable
            />
          </label>

          <div className="type-container">
            {formData.furgon && (
              <>
                <button
                  type="button"
                  className={
                    furgonCargado ? "type-btn positive-active" : "type-btn"
                  }
                  onClick={() => handleCarga(true)}
                >
                  <XLogo className="check-logo" />
                  CARGADO
                </button>
                <button
                  type="button"
                  className={
                    !furgonCargado ? "type-btn negative-active" : "type-btn"
                  }
                  onClick={() => handleCarga(false)}
                >
                  <OkLogo className="check-logo" />
                  VACIO
                </button>{" "}
              </>
            )}
          </div>

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
            <TextButton
              text={uploading ? "Guardando..." : "Guardar"}
              onClick={handleSubmit}
              type="submit"
              disabled={uploading}
            />
            <TextButton text="Cancelar" onClick={onClose} type="button" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEventoPorteria;

// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  quitarItem,
  agregarItem,
  reemplazarItems,
} from "../../functions/stockFunctions";
import { agregarEvento } from "../../functions/eventFunctions";
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";
import tiposEventos from "../../functions/data/eventos.json";
import TextButton from "../buttons/TextButton";
import "./css/Forms.css";

const FormLlave = ({
  elemento = {},
  sector = "porteria",
  onClose,
  onGuardar,
}) => {
  const { personas, tractores, empresas } = useData();
  const [uploading, setUploading] = useState(false);
  const SUCURSAL = "01"; // Por defecto DON TORCUATO
  const depositos = {
    depo_porteria: "llaves",
    depo_tractores: "llaves-taller-tractores",
  };
  const area = sector;
  const subarea = "llaveporteria"; // para listar tipos de eventos únicament
  const [formData, setFormData] = useState({
    tipo: elemento.tipo || "",
    persona: elemento.persona ? elemento.persona : "",
    operador: elemento.operador ? elemento.operador : "",
    tractor: elemento.tractor
      ? Array.isArray(elemento.tractor)
        ? elemento.tractor
        : [elemento.tractor]
      : [],
    parteTr: elemento.parteTr || false,
    detalle: elemento.detalle || "",
  });

  const operadoresPorteria = personas.filter(
    (o) => o.puesto === "VIGILANCIA" || o.puesto === "SEGURIDAD"
  );

  const operadoresTallerTractores = personas.filter(
    (o) => o.apellido === "RINCON" || o.apellido === "MILLET"
  );

  let listadoOperadores;

  switch (sector) {
    case "porteria":
      listadoOperadores = operadoresPorteria;
      break;
    case "tractores":
      listadoOperadores = operadoresTallerTractores;
      break;
    default:
      listadoOperadores = personas;
      break;
  }

  const subtiposDisponibles = subarea
    ? tiposEventos[subarea.toUpperCase()] || []
    : Object.entries(tiposEventos).flatMap(([nArea, subtipos]) =>
        subtipos.map((sub) => ({ nArea, subtipo: sub }))
      );

  const [tipoSeleccionado, setTipoSeleccionado] = useState(""); // si deja/recibe llave una persona o un proveedor
  const [dejaParteTr, setDejaParteTr] = useState(false); // para partes de taller de tractores

  useEffect(() => {
    const cargarDatos = async () => {
      const fechaEvento = elemento.fecha
        ? formatearFecha(elemento.fecha) + " " + formatearHora(elemento.fecha)
        : formatearFecha(new Date()) + " " + formatearHora(new Date());

      const oldData = {
        fecha: fechaEvento,
        tipo: elemento.tipo || "",
        persona: elemento.persona ? String(elemento.persona) : null,
        servicio: elemento.servicio ? String(elemento.servicio) : null,
        recibeServicio: !elemento.persona && elemento.servicio ? true : false,
        operador: elemento.operador ? String(elemento.operador) : null,
        tractor: elemento.tractor
          ? Array.isArray(elemento.tractor)
            ? elemento.tractor
            : [elemento.tractor]
          : [],
        parteTr: elemento.parteTr || false,
        detalle: elemento.detalle || "",
      };

      setFormData(oldData);

      if (oldData.persona) {
        setTipoSeleccionado("chofer");
      } else if (!oldData.persona && oldData.servicio) {
        setTipoSeleccionado("servicio");
      } else {
        setTipoSeleccionado("chofer");
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParteTr = (state) => {
    if (state) {
      setDejaParteTr(true);
      setFormData((prev) => ({
        ...prev,
        parteTr: state,
      }));
    } else {
      setDejaParteTr(false);
      setFormData((prev) => ({
        ...prev,
        parteTr: state,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const deposito =
      sector === "tractores"
        ? depositos.depo_tractores
        : depositos.depo_porteria;

    const otrosDepositos = Object.values(depositos).filter(
      (d) => d !== deposito
    );

    try {
      let fechaParaGuardar;
      if (elemento?.id && elemento.fecha) {
        fechaParaGuardar = elemento.fecha.toDate
          ? elemento.fecha.toDate()
          : new Date(elemento.fecha);
      } else {
        fechaParaGuardar = new Date();
      }

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        tipo: formData.tipo ? formData.tipo.toUpperCase() : null,
        servicio:
          formData.tipo !== "INVENTARIO" && formData.servicio
            ? Number(formData.servicio)
            : null,
        persona:
          formData.tipo !== "INVENTARIO" && formData.persona
            ? Number(formData.persona)
            : null,
        operador: formData.operador ? Number(formData.operador) : null,
        tractor: formData.tractor ? formData.tractor.map(Number) : [], // array de internos
        parteTr: formData.parteTr ? formData.parteTr : false,
        area: formData.area ? formData.area : area,
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,
      };

      await agregarEvento(datosAGuardar, area, elemento.id);
      if (datosAGuardar.tipo === "ENTREGA" || datosAGuardar === "DEJA") {
        // eliminar llave/s de otros depositos
        for (const otroDepo of otrosDepositos) {
          quitarItem(SUCURSAL, "ubicaciones", otroDepo, datosAGuardar.tractor);
        }
        // agregar llave/s al deposito correcto
        await agregarItem(
          SUCURSAL,
          "ubicaciones",
          deposito,
          datosAGuardar.tractor
        );
      } else if (datosAGuardar.tipo === "RETIRA") {
        await quitarItem(
          SUCURSAL,
          "ubicaciones",
          deposito,
          datosAGuardar.tractor
        );
      } else if (datosAGuardar.tipo === "INVENTARIO") {
        // eliminar llave/s de otros depositos
        for (const otroDepo of otrosDepositos) {
          quitarItem(SUCURSAL, "ubicaciones", otroDepo, datosAGuardar.tractor);
        }
        // definir inventario
        await reemplazarItems(SUCURSAL, deposito, datosAGuardar.tractor);
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
          <h2>{elemento.id ? elemento.id : "REGISTRO DE LLAVES"}</h2>
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
          {/* Operador */}
          <label>
            Operador *
            <Select
              options={listadoOperadores
                .map((o) => ({
                  value: o.id,
                  label: `${o.apellido} ${o.nombres} (DNI: ${o.dni})`,
                  apellido: o.apellido, //para ordenar
                }))
                .sort((a, b) => a.apellido.localeCompare(b.apellido))}
              value={
                formData.operador
                  ? personas
                      .map((o) => ({
                        value: o.id,
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
          <br />

          {/* Chofer o Servicio */}
          <div className="type-container-small">
            <button
              type="button"
              className={
                formData.tipo === "INVENTARIO"
                  ? "type-btn"
                  : tipoSeleccionado === "chofer"
                  ? "type-btn positive-active-black"
                  : "type-btn"
              }
              onClick={() => setTipoSeleccionado("chofer")}
              disabled={formData.tipo === "INVENTARIO"}
            >
              CHOFER {tipoSeleccionado === "chofer" ? " *" : null}{" "}
            </button>
            <button
              type="button"
              className={
                formData.tipo === "INVENTARIO"
                  ? "type-btn"
                  : tipoSeleccionado === "servicio"
                  ? "type-btn positive-active-black"
                  : "type-btn"
              }
              onClick={() => setTipoSeleccionado("servicio")}
              disabled={formData.tipo === "INVENTARIO"}
            >
              SERVICIO {tipoSeleccionado === "servicio" ? " *" : null}
            </button>
          </div>
          <label>
            {tipoSeleccionado === "chofer" ? (
              <Select
                isDisabled={formData.tipo === "INVENTARIO"}
                options={personas
                  .map((p) => ({
                    value: p.id,
                    label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
                    apellido: p.apellido, //para ordenar alfabeticamente
                  }))
                  .sort((a, b) => a.apellido.localeCompare(b.apellido))}
                value={
                  formData.persona
                    ? personas
                        .map((p) => ({
                          value: p.id,
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
            ) : (
              <Select
                isDisabled={formData.tipo === "INVENTARIO"}
                options={empresas
                  .filter((e) => e.tipo === "proveedor")
                  .map((s) => ({
                    value: s.id,
                    label: `${s.nombre}`,
                    nombre: s.nombre, //para orden alfabet..
                  }))
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))}
                value={
                  formData.servicio
                    ? empresas
                        .map((s) => ({
                          value: s.id,
                          label: `${s.nombre}`,
                        }))
                        .find((opt) => opt.value === formData.servicio)
                    : null
                }
                onChange={(opt) =>
                  handleChange({
                    target: { name: "servicio", value: opt ? opt.value : "" },
                  })
                }
                placeholder=""
                isClearable
                required
              />
            )}
          </label>

          {/* Tractor */}
          <label>
            Tractor *
            <Select
              options={tractores.map((t) => ({
                value: t.id,
                label: `${t.interno} (${t.dominio})`,
              }))}
              value={tractores
                .map((t) => ({
                  value: t.id,
                  label: `${t.interno} (${t.dominio})`,
                }))
                .filter((opt) =>
                  formData.tractor.map(String).includes(opt.value)
                )}
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
          <div className="type-container">
            <button
              type="button"
              className={
                formData.parteTr
                  ? "type-btn positive-active-yellow"
                  : "type-btn"
              }
              onClick={() => handleParteTr(!dejaParteTr)}
            >
              PARTE TALLER TRACTORES
            </button>
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
              text={uploading ? "Guardando ... " : "Guardar"}
              type="submit"
              disabled={uploading}
            />
            <TextButton text="Cancelar" type="button" onClick={onClose} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormLlave;

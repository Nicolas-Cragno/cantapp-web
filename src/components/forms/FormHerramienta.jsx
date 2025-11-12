// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
// ----------------------------------------------------------------------- imports externos
import { useData } from "../../context/DataContext";
import { agregarEvento } from "../../functions/eventFunctions";
import {
  unidadArticulo,
  marcaPorCodigo,
  abreviarUnidad,
  buscarPersona,
  buscarDominio,
} from "../../functions/dataFunctions";
import {
  quitarItem,
  agregarItem,
  actualizarHerramientas,
} from "../../functions/stockFunctions";
import InputValidator from "../devs/InputValidator";
import TextButton from "../buttons/TextButton";
import PlusLogo from "../../assets/logos/pluslogo.png";
import RefreshLogo from "../../assets/logos/refreshlogo.png";
import DropLogo from "../../assets/logos/droplogo.png";
import "./css/Forms.css";
import { type } from "@testing-library/user-event/dist/type";

// ATENCION: La logica cambia, NO recibe evento, recibe una persona como "elemento"

const FormHerramienta = ({
  elemento = null,
  sector = null,
  onClose,
  onGuardar,
}) => {
  const { personas, stock, usuario } = useData();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    persona: elemento?.id || "",
    herramientas: elemento?.herramientas || [],
    detalle: "",
    operador: "",
  });
  const AREA = sector || "administracion";
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [ingresos, setIngresos] = useState([]);
  const [articulosUsados, setArticulosUsados] = useState([]);
  const [articulosUsadosBackUp, setArticulosUsadosBackUp] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [listadoHerramientas, setListadoHerramientas] = useState([]);

  const [esDev, setEsDev] = useState(false);

  useEffect(() => {
    if (usuario?.rol === "dev") setEsDev(true);
    if (usuario && personas.length > 0) {
      const personaUsuaria = personas.find(
        (p) => String(p.dni) === String(usuario.dni)
      );

      if (personaUsuaria) {
        setFormData((prev) => ({
          ...prev,
          operador: personaUsuaria.id,
        }));
      }
    }
    if (elemento && personas.length > 0) {
      const personaFS = personas.find(
        (p) => String(p.dni) === String(elemento.id)
      );

      if (personaFS) {
        setFormData((prev) => ({
          ...prev,
          persona: personaFS.id,
        }));
      }
    }
  }, [usuario, personas]);

  useEffect(() => {
    const listaEmpleados = personas.filter(
      (p) => p.estado === 1 || p.estado === true
    );

    const listaHerramientas = stock.filter(
      (a) => a.tipo.toUpperCase() === "HERRAMIENTA"
    );

    setEmpleados(listaEmpleados);
    setListadoHerramientas(listaHerramientas);
  }, []);
  useEffect(() => {
    if (elemento && elemento.herramientas) {
      setArticulosUsados(
        elemento.herramientas.map((h) => ({
          id: h.id,
          descripcion: h.descripcion,
          marca: h.marca,
          codigoProveedor: h.codigoProveedor,
          cantidad: h.cantidad,
          unidad: h.unidad,
        }))
      );
      setArticulosUsadosBackUp(elemento.herramientas);
    }
  }, [elemento]);

  useEffect(() => {
    // Combina herramientas originales (Firestore) + nuevas agregadas
    const combinadas = [...articulosUsados, ...ingresos];
    setFormData((data) => ({ ...data, herramientas: combinadas }));
  }, [articulosUsados, ingresos]);
  const handleRestore = () => {
    setArticulosUsados(articulosUsadosBackUp); // restablecer al listado original de firestore
    setIngresos([]); // limpiar ingresos agregados manualmente
  };
  const handleAdd = () => {
    if (!articuloSeleccionado || !cantidad || isNaN(cantidad)) {
      Swal.fire(
        "Error",
        "Selecciona un artículo y una cantidad válida",
        "warning"
      );
      return;
    }

    const articulo = stock.find((a) => a.id === articuloSeleccionado);

    const nuevoIngreso = {
      id: articulo.id,
      descripcion: articulo.descripcion,
      marca: articulo.marca,
      codigoProveedor: articulo.codigoProveedor,
      cantidad: Number(cantidad),
      unidad: articulo.unidad,
    };

    setIngresos((prev) => [...prev, nuevoIngreso]);

    setArticuloSeleccionado("");
    setCantidad("");
  };
  const handleDelete = (indexEliminar) => {
    const totalUsados = articulosUsados.length;

    if (indexEliminar < totalUsados) {
      // Está en el array de artículos ya usados (venían de Firestore)
      setArticulosUsados((prev) => prev.filter((_, i) => i !== indexEliminar));
    } else {
      // Está en el array de ingresos nuevos
      const ingresoIndex = indexEliminar - totalUsados;
      setIngresos((prev) => prev.filter((_, i) => i !== ingresoIndex));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fechaParaGuardar;
      if (elemento?.id && elemento.fecha) {
        fechaParaGuardar = elemento.fecha.toDate
          ? elemento.fecha.toDate()
          : new Date(elemento.fecha);
      } else {
        fechaParaGuardar = new Date();
      }

      let herramientasQuitadas = [];

      if (articulosUsadosBackUp.length > 0) {
        herramientasQuitadas = articulosUsadosBackUp
          .map((art) => {
            const busqueda = formData.herramientas.find((a) => a.id === art.id);
            if (!busqueda) return art;
            if (busqueda.cantidad < art.cantidad) {
              return {
                ...art,
                cantidad: art.cantidad - busqueda.cantidad,
              };
            }
            return null;
          })
          .filter(Boolean);
      }

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        area: AREA,
        tipo: "ASIGNACION",
        persona: formData.persona || null,
        operador: formData.operador ? formData.operador : null,
        herramientas: formData.herramientas || [], //para actualizar el listado de la persona (ingresos+lo que ya estaba)
        ingresos: ingresos || [], //para el evento de asignacion
        egresos: herramientasQuitadas || [],
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,
      };

      if (
        !formData.persona ||
        !formData.operador ||
        formData.herramientas.length === 0
      ) {
        Swal.fire(
          "Datos incompletos",
          "Debe seleccionar persona, operador y al menos una herramienta.",
          "warning"
        );
        setUploading(false);
        return;
      }

      /*
      console.log(datosAGuardar);
      console.log(articulosUsadosBackUp);
      console.log(herramientasQuitadas);
      console.log(ingresos);
      */

      const confirmacion = await Swal.fire({
        title: "Confirmar datos",
        html: `
              <b>Fecha:</b> ${fechaParaGuardar.toLocaleString()}<hr>
              <b>Persona:</b> ${buscarPersona(
                personas,
                datosAGuardar.persona
              )}<br>
              <b>Operador:</b> ${buscarPersona(
                personas,
                datosAGuardar.operador
              )}<br>
              <b>Detalle:</b> ${datosAGuardar.detalle || "-"}<hr>
              <b>Nuevas herramientas asignadas ↓</b><hr> ${
                formData.herramientas.length > 0
                  ? `<ul style="text-align:center; padding-left:25px;">
                  ${datosAGuardar.ingresos
                    .map(
                      (h) => `
                      <li style="font-size:smaller; list-style:none">
                        <b>${h.id}</b> - ${h.descripcion} <strong style="font-size: xx-smaller">(${h.cantidad} ${h.unidad})</strong>
                      </li>`
                    )
                    .join("")}
                </ul>`
                  : "<i>Sin asignaciones</i>"
              }<hr>
               <b>Devoluciones ↓</b><hr> ${
                 herramientasQuitadas.length > 0
                   ? `<ul style="text-align:center; padding-left:25px;">
                  ${herramientasQuitadas
                    .map(
                      (h) => `
                      <li style="font-size:smaller; list-style:none">
                        <b>${h.id}</b> - ${h.descripcion} <strong style="font-size: xx-smaller">(${h.cantidad} ${h.unidad})</strong>
                      </li>`
                    )
                    .join("")}
                </ul>`
                   : "<i>Sin devoluciones</i>"
               }
              `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#4161bd",
        cancelButtonColor: "#999",
      });

      if (!confirmacion.isConfirmed) {
        setUploading(false);
        return;
      }

      const eventoGuardado = await agregarEvento(datosAGuardar, AREA);
      const idPersona = elemento ? elemento.id : datosAGuardar.persona;

      await actualizarHerramientas(
        idPersona,
        "personas",
        "herramientas",
        datosAGuardar.herramientas
      );

      if (onGuardar) onGuardar();
      Swal.fire({
        title: "Asignación guardada",
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
      setUploading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{elemento ? "EDITAR ASIGNACIÓN" : "ASIGNAR HERRAMIENTA"}</h2>

        <hr />
        <form onSubmit={handleSubmit}>
          {/* PERSONA */}
          <div className="ficha-info">
            <div className="dev">
              <label>Empleado *</label>

              {esDev && <InputValidator campo={formData.persona} />}
            </div>
            <Select
              options={empleados
                .map((e) => ({
                  value: e.id,
                  label: `${e.apellido} ${e.nombres} (DNI: ${e.dni})`,
                  apellido: e.apellido, //para ordenar
                }))
                .sort((a, b) => a.apellido.localeCompare(b.apellido))}
              value={
                formData.persona
                  ? empleados
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
              isDisabled={elemento?.id}
              required
            />
            <br />
            <div className="dev">
              <label>Operador *</label>
              {esDev && <InputValidator campo={formData.operador} />}
            </div>
            <Select
              options={empleados
                .map((e) => ({
                  value: e.id,
                  label: `${e.apellido} ${e.nombres} (DNI: ${e.dni})`,
                  apellido: e.apellido, //para ordenar
                }))
                .sort((a, b) => a.apellido.localeCompare(b.apellido))}
              value={
                formData.operador
                  ? empleados
                      .map((p) => ({
                        value: p.id,
                        label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
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
          </div>
          {/* HERRAMIENTAS */}
          <div className="ficha-info">
            <div className="dev">
              <label>Herramienta</label>
              {esDev && <InputValidator campo={articuloSeleccionado} />}
            </div>
            <div className="select-with-button">
              <Select
                className="select-grow"
                options={listadoHerramientas
                  .map((a) => ({
                    value: a.id,
                    label: `${a.id} - ${a.descripcion} (${marcaPorCodigo(
                      stock,
                      a.id
                    ).toUpperCase()}${
                      a.codigoProveedor
                        ? " " + a.codigoProveedor.toUpperCase()
                        : ""
                    }) ${a.detalle ? " | " + a.detalle.toUpperCase() : ""}`,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label))}
                value={
                  articuloSeleccionado
                    ? (() => {
                        const articulo = stock.find(
                          (a) => a.id === articuloSeleccionado
                        );
                        if (!articulo) return null;
                        return {
                          value: articulo.id,
                          label: `${articulo.id} - ${
                            articulo.descripcion
                          } (${marcaPorCodigo(
                            stock,
                            articulo.id
                          ).toUpperCase()}${
                            articulo.codigoProveedor
                              ? " " + articulo.codigoProveedor.toUpperCase()
                              : ""
                          }) ${
                            articulo.detalle
                              ? " | " + articulo.detalle.toUpperCase()
                              : ""
                          }`,
                        };
                      })()
                    : null
                }
                onChange={(opt) => {
                  if (opt) {
                    const idSeleccionado = opt.value;
                    setArticuloSeleccionado(idSeleccionado);
                    const articulo = stock.find((a) => a.id === idSeleccionado);
                  } else {
                    setArticuloSeleccionado("");
                  }
                }}
                placeholder="Seleccionar repuesto..."
                isClearable
              />
              {/*
                  <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickArticulo}
                  />
                  */}
            </div>

            <div className="dev">
              <label>Cantidad</label>
              {esDev && <InputValidator campo={cantidad} />}
            </div>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
            />

            <div className="unidad-display">
              <input
                type="text"
                value={
                  articuloSeleccionado
                    ? unidadArticulo(stock, articuloSeleccionado)
                    : ""
                }
                disabled
              />
              <img
                src={PlusLogo}
                alt=""
                onClick={handleAdd}
                className="plus-logo"
              />
            </div>
          </div>

          <p className="ficha-info-title">
            <strong>Herramientas a asignar</strong>
            {esDev && <InputValidator campo={ingresos} />}
          </p>
          <div className="ficha-info">
            <ul className="list">
              {[...articulosUsados, ...ingresos].map((item, index) => (
                <li key={index} className="list-item">
                  <div className="item-info">
                    <strong>{item.id}</strong>
                  </div>
                  <div className="item-info">
                    {item.descripcion}
                    {item.marca
                      ? " (" +
                        item.marca.toUpperCase() +
                        ` ${
                          item.codigoProveedor &&
                          item.codigoProveedor.toUpperCase()
                        }` +
                        ")" +
                        `${
                          item.detalle ? " | " + item.detalle.toUpperCase() : ""
                        }`
                      : ""}
                  </div>

                  <div className="item-actions">
                    <span className="list-cant3">
                      + {item.cantidad}
                      {" " + abreviarUnidad(item.unidad)}
                    </span>

                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() => handleDelete(index)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {articulosUsados.length + ingresos.length > 0 && (
            <div className="form-footer">
              {elemento?.id ? (
                <>
                  <span className="logo-text">Restablecer</span>
                  <img
                    src={RefreshLogo}
                    alt=""
                    onClick={handleRestore}
                    className="plus-logo"
                  ></img>
                </>
              ) : (
                <>
                  <span className="logo-text">Borrar</span>
                  <img
                    src={DropLogo}
                    alt=""
                    onClick={handleRestore}
                    className="plus-logo"
                  ></img>
                </>
              )}
            </div>
          )}
          <div className="form-group">
            <div className="dev">
              <label>Detalle</label>
              {esDev && <InputValidator campo={formData.detalle} />}
            </div>

            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
            />
          </div>
          {/* BOTONES */}
          <div className="form-buttons">
            <button type="submit" className="btn-guardar" disabled={uploading}>
              {uploading ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormHerramienta;

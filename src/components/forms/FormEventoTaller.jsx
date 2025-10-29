// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { agregarEvento } from "../../functions/eventFunctions";
import {
  formatearFecha,
  formatearHora,
  unidadArticulo,
  marcaPorCodigo,
  buscarPersona,
  buscarDominio,
  abreviarUnidad,
} from "../../functions/dataFunctions";
import TextButton from "../buttons/TextButton";
import FormGestor from "./FormGestor";
import tiposEventos from "../../functions/data/eventos.json";
import PlusLogo from "../../assets/logos/pluslogo.png";
import RefreshLogo from "../../assets/logos/refreshlogo.png";
import DropLogo from "../../assets/logos/droplogo.png";
import "./css/Forms.css";

const FormEventoTaller = ({
  elemento = {},
  area = "tractores",
  subarea = null,
  onClose,
  onGuardar,
}) => {
  const evento = elemento || {};

  const { tractores, furgones, vehiculos, personas, stock } = useData();

  const [formData, setFormData] = useState({
    tipo: evento?.tipo || "",
    chofer: evento?.chofer ? String(evento.chofer) : "",
    //mecanico: evento?.mecanico ? String(evento.mecanico) : "", // mecanico individual
    mecanico: evento?.mecanico
      ? Array.isArray(evento.mecanico)
        ? evento.mecanico
        : [evento.mecanico]
      : [], // 1 o varios mecanico/s
    tractor: evento?.tractor || "",
    kilometraje: evento?.kmTractor || "",
    furgon: evento?.furgon || "",
    detalle: evento?.detalle || "",
    area: evento?.area || area,
    subarea: evento?.subarea || subarea,
  });

  const subtiposDisponibles = tiposEventos[area.toUpperCase()];

  const [mecanicos, setMecanicos] = useState([]);
  const [choferes, setChoferes] = useState([]);

  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [articulosUsados, setArticulosUsados] = useState([]);
  const [articulosUsadosBackUp, setArticulosUsadosBackUp] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [ingresos, setIngresos] = useState([]); // para el listado de repuestos a usar
  const [uploading, setUploading] = useState(false); // Para evitar doble cargas
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalArticuloVisible, setModalArticuloVisible] = useState(false);

  useEffect(() => {
    const listadoMecanicos = personas.filter((p) => p.puesto === "MECANICO");
    setMecanicos(listadoMecanicos);

    const listadoChoferes = personas.filter(
      (p) =>
        p.puesto === "CHOFER LARGA DISTANCIA" ||
        p.puesto === "CHOFER MOVIMIENTO" ||
        p.puesto === "CHOFER FLETERO" ||
        p.puesto === "FLETERO"
    );
    setChoferes(listadoChoferes);
  }, [personas]);

  useEffect(() => {
    if (evento.id && evento.repuestos) {
      setArticulosUsados(
        evento.repuestos.map((r) => ({
          id: r.id,
          descripcion: r.descripcion,
          marca: r.marca,
          codigoProveedor: r.codigoProveedor,
          cantidad: r.cantidad,
          unidad: r.unidad,
        }))
      );
      setArticulosUsadosBackUp(evento.repuestos); // para poder restaurar
    }
  }, [evento.id]);
  const handleRestore = () => {
    setArticulosUsados(articulosUsadosBackUp); // restablecer al listado original de firestore
    setIngresos([]); // limpiar ingresos agregados manualmente
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // --- Preparar fecha ---
      let fechaParaGuardar;
      if (evento.id) {
        fechaParaGuardar = evento.fecha?.toDate
          ? evento.fecha.toDate()
          : new Date(evento.fecha);
      } else {
        fechaParaGuardar = new Date();
      }
      if (isNaN(fechaParaGuardar.getTime()))
        throw new Error("La fecha es inválida");

      const usuarioJSON = JSON.parse(localStorage.usuario);
      const usuarioDeCarga = `${usuarioJSON.apellido} ${usuarioJSON.nombres}`;

      const listaArticulosFinal = [...articulosUsados, ...ingresos];
      const repuestos = listaArticulosFinal.map((item) => ({
        id: item.id,
        descripcion: item.descripcion,
        marca: item.marca,
        codigoProveedor: item.codigoProveedor,
        cantidad: item.cantidad,
        unidad: item.unidad,
      }));

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        chofer: formData.chofer ? Number(formData.chofer) : null,
        //mecanico: formData.mecanico ? Number(formData.mecanico) : null,
        mecanico: formData.mecanico ? formData.mecanico.map(Number) : [], // array de dni
        subtipo: formData.subtipo?.toUpperCase() || null,
        persona: formData.persona ? Number(formData.persona) : null,
        vehiculo: formData.vehiculo ? Number(formData.vehiculo) : null,
        tractor: formData.tractor ? Number(formData.tractor) : null,
        furgon: formData.furgon ? Number(formData.furgon) : null,
        kilometraje: formData.kilometraje ? Number(formData.kilometraje) : null,
        area: formData.area || area,
        subarea: formData.subarea || subarea,
        detalle: formData.detalle?.toUpperCase() || null,
        usuario: evento.id ? evento.usuario || usuarioDeCarga : usuarioDeCarga,
        repuestos,
      };

      const confirmacion = await Swal.fire({
        title: "Confirmar datos",
        html: `
        <b>Fecha:</b> ${fechaParaGuardar.toLocaleString()}<hr>
        <b>Mecanico:</b> ${
          datosAGuardar.mecanico.map((m) => buscarPersona(personas, m)) || "-"
        }<br>
        <b>Chofer:</b> ${
          buscarPersona(personas, datosAGuardar.chofer) || "-"
        }<br>
        <b>Vehículo:</b> ${
          datosAGuardar.tractor
            ? datosAGuardar.tractor +
              " (" +
              buscarDominio(datosAGuardar.tractor, tractores) +
              ")"
            : datosAGuardar.furgon
            ? datosAGuardar.furgon +
              " (" +
              buscarDominio(datosAGuardar.furgon, furgones) +
              ")"
            : datosAGuardar.vehiculo
            ? datosAGuardar.vehiculo +
              " (" +
              buscarDominio(datosAGuardar.vehiculo, vehiculos) +
              ")"
            : "-"
        }<br>
        <b>Kilometraje:</b> ${datosAGuardar.kilometraje || "-"}<br><hr>
        <b>Detalle:</b> ${datosAGuardar.detalle || "-"}<hr>
        <b>Repuestos:</b><hr> ${
          repuestos.length > 0
            ? `<ul style="text-align:left; padding-left:25px;">
            ${repuestos
              .map(
                (r) => `
                <li style="font-size:smaller; list-style:none">
                  <b>${r.id}</b> - ${r.descripcion} (${r.cantidad} ${r.unidad})
                </li>`
              )
              .join("")}
          </ul>`
            : "<i>Sin repuestos</i>"
        }      `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#4161bd",
        cancelButtonColor: "#999",
      });

      if (!confirmacion.isConfirmed) {
        setUploading(false);
        return; // Si cancela, no guarda
      }

      const eventoGuardado = evento.id
        ? await agregarEvento(datosAGuardar, area, evento.id)
        : await agregarEvento(datosAGuardar, area);

      const idEvento = eventoGuardado.id;

      if (onGuardar) onGuardar();
      Swal.fire({
        title: `Evento guardado: ${idEvento}`,
        text: "Se ha completado el registro exitosamente.",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });

      onClose();
    } catch (error) {
      console.error("Error al guardar evento:", error);
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      onClose();
    } finally {
      setUploading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  const handleClickVehiculo = async () => {
    setModalVehiculoVisible(true);
  };
  const handleClickPersona = async () => {
    setModalPersonaVisible(true);
  };
  const handleClickArticulo = async () => {
    setModalArticuloVisible(true);
  };
  const cerrarModalVehiculo = () => {
    setModalVehiculoVisible(false);
  };
  const cerrarModalPersona = () => {
    setModalPersonaVisible(false);
  };
  const cerrarModalArticulo = () => {
    setModalArticuloVisible(false);
  };
  return (
    <div className="doble-form">
      <div className="doble-form-content">
        <div className="form-header">
          <h2>{evento.id ? "Editar Trabajo" : "Nuevo Trabajo"}</h2>

          <h2 className="black-txt">
            {evento.id
              ? formatearFecha(evento.fecha) +
                " " +
                formatearHora(evento.fecha) +
                " hs"
              : new Date().toLocaleDateString()}
          </h2>
          <p>* campo obligatorio</p>
        </div>
        <form onSubmit={handleSubmit} className="modal-formulario-doble">
          <div className="form-left">
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
              Mecánico
              <div className="select-with-button">
                <Select
                  className="select-grow"
                  options={mecanicos
                    .map((p) => ({
                      value: p.id,
                      label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
                      apellido: p.apellido,
                    }))
                    .sort((a, b) => a.apellido.localeCompare(b.apellido))}
                  value={
                    formData.mecanico && Array.isArray(formData.mecanico)
                      ? mecanicos
                          .filter((p) => formData.mecanico.includes(p.id))
                          .map((p) => ({
                            value: p.id,
                            label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
                          }))
                      : []
                  }
                  onChange={(opts) =>
                    setFormData({
                      ...formData,
                      mecanico: opts ? opts.map((o) => o.value) : [],
                    })
                  }
                  placeholder=""
                  isClearable
                  isMulti
                  required
                />
                <TextButton
                  text="+"
                  className="mini-btn"
                  onClick={handleClickPersona}
                />
              </div>
            </label>

            {area === "tractores" ? (
              <>
                <div className="doble-select">
                  <label>
                    Tractor *
                    <div className="select-with-button">
                      <Select
                        className="select-grow"
                        options={tractores
                          .map((t) => ({
                            value: t.interno,
                            label: `${t.dominio} (${t.interno}) ${
                              t.chasis ? "- " + t.chasis : ""
                            }`,
                            int: t.interno,
                          }))
                          .sort((a, b) => a.int - b.int)}
                        value={
                          formData.tractor
                            ? {
                                value: formData.tractor,
                                label:
                                  tractores.find(
                                    (t) => t.interno === formData.tractor
                                  )?.dominio + ` (${formData.tractor})`,
                              }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData({
                            ...formData,
                            tractor: opt ? opt.value : "",
                          })
                        }
                        placeholder=""
                        isClearable
                        required={area === "tractores"}
                      />
                      <TextButton
                        text="+"
                        className="mini-btn"
                        onClick={handleClickVehiculo}
                      />
                    </div>
                  </label>
                  <label>
                    Kilometraje
                    <input
                      className="input-grow"
                      type="number"
                      value={formData.kilometraje}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kilometraje: e ? Number(e.target.value) : 0,
                        })
                      }
                      min="1"
                    />
                  </label>
                </div>
              </>
            ) : null}

            {area === "furgones" ? (
              <>
                <label>
                  Furgon *
                  <div className="select-with-button">
                    <Select
                      className="select-grow"
                      options={furgones
                        .map((f) => ({
                          value: f.interno,
                          label: `${f.dominio} (${f.interno})`,
                          int: f.interno,
                        }))
                        .sort((a, b) => a.int - b.int)}
                      value={
                        formData.furgon
                          ? {
                              value: formData.furgon,
                              label:
                                furgones.find(
                                  (t) => t.interno === formData.furgon
                                )?.dominio + ` (${formData.furgon})`,
                            }
                          : null
                      }
                      onChange={(opt) =>
                        setFormData({
                          ...formData,
                          furgon: opt ? opt.value : "",
                        })
                      }
                      placeholder=""
                      isClearable
                      required={area === "furgones"}
                    />
                    <TextButton
                      text="+"
                      className="mini-btn"
                      //onClick={handleClickFurgon}
                    />
                  </div>
                </label>
              </>
            ) : null}

            <label>
              Chofer
              <div className="select-with-button">
                <Select
                  className="select-grow"
                  options={choferes
                    .map((p) => ({
                      value: p.id,
                      label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
                      apellido: p.apellido,
                    }))
                    .sort((a, b) => a.apellido.localeCompare(b.apellido))}
                  value={
                    formData.chofer
                      ? {
                          value: formData.chofer,
                          label:
                            choferes.find((p) => p.id === formData.chofer)
                              ?.apellido +
                            " " +
                            choferes.find((p) => p.id === formData.chofer)
                              ?.nombres +
                            ` (DNI: ${formData.chofer})`,
                        }
                      : null
                  }
                  onChange={(opt) =>
                    setFormData({ ...formData, chofer: opt ? opt.value : "" })
                  }
                  placeholder=""
                  isClearable
                  //required
                />
                <TextButton
                  text="+"
                  className="mini-btn"
                  onClick={handleClickPersona}
                />
              </div>
            </label>

            <label>
              Detalle
              <textarea
                name="detalle"
                value={formData.detalle}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-right">
            <div className="form-box overflow-visible">
              <label>
                Cargar repuesto
                <div className="select-with-button">
                  <Select
                    className="select-grow"
                    options={stock
                      .map((a) => ({
                        value: a.id,
                        label: `${a.id} - ${a.descripcion} (${marcaPorCodigo(
                          stock,
                          a.id
                        ).toUpperCase()}${
                          a.codigoProveedor
                            ? " " + a.codigoProveedor.toUpperCase()
                            : ""
                        })`,
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
                              })`,
                            };
                          })()
                        : null
                    }
                    onChange={(opt) => {
                      if (opt) {
                        const idSeleccionado = opt.value;
                        setArticuloSeleccionado(idSeleccionado);
                        const articulo = stock.find(
                          (a) => a.id === idSeleccionado
                        );
                      } else {
                        setArticuloSeleccionado("");
                      }
                    }}
                    placeholder="Seleccionar repuesto..."
                    isClearable
                  />
                  <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickArticulo}
                  />
                </div>
              </label>
              <div className="input-inline">
                <label>
                  Cantidad
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    min="1"
                  />
                </label>
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
            </div>
            <div className="form-box">
              <ul className="list">
                {[...articulosUsados, ...ingresos].map((item, index) => (
                  <li key={index} className="list-item">
                    <div className="item-info">
                      <strong>{item.id}</strong>
                    </div>
                    <div className="item-info">
                      {item.descripcion}
                      {item.marca ? " | " + item.marca.toUpperCase() : ""}
                      {item.codigoProveedor
                        ? ` (${item.codigoProveedor.toUpperCase()})`
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
            <div className="form-box-footer">
              {evento.id ? (
                <img
                  src={RefreshLogo}
                  alt=""
                  onClick={handleRestore}
                  className="plus-logo"
                ></img>
              ) : (
                <img
                  src={DropLogo}
                  alt=""
                  onClick={handleRestore}
                  className="plus-logo"
                ></img>
              )}
            </div>
            <div className="form-buttons">
              <button type="submit" disabled={uploading}>
                {uploading ? "Guardando ..." : "Guardar"}
              </button>
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
      {modalVehiculoVisible && (
        <FormGestor
          tipo={"vehiculo"}
          filtroVehiculo={"tractores"}
          onClose={cerrarModalVehiculo}
          onGuardar={handleSubmit}
        />
      )}
      {modalPersonaVisible && (
        <FormGestor
          tipo={"persona"}
          onClose={cerrarModalPersona}
          onGuardar={handleSubmit}
        />
      )}
      {modalArticuloVisible && (
        <FormGestor
          tipo={"stock"}
          onClose={cerrarModalArticulo}
          onGuardar={handleSubmit}
        />
      )}
    </div>
  );
};

export default FormEventoTaller;

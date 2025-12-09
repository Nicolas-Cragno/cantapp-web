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
  agregarFaltante,
} from "../../functions/dataFunctions";
import TextButton from "../buttons/TextButton";
import InputValidator from "../devs/InputValidator";
import FormGestor from "./FormGestor";
import tiposEventos from "../../functions/data/eventos.json";
import PlusLogo from "../../assets/logos/pluslogo.png";
import RefreshLogo from "../../assets/logos/refreshlogo.png";
import DropLogo from "../../assets/logos/droplogo.png";
import "./css/Forms.css";

const FormEventoTaller = ({
  elemento = {},
  area = "tractores",
  tipoVehiculo = null,
  subarea = null,
  onClose,
  onGuardar,
}) => {
  const evento = elemento || {};
  area = tipoVehiculo ? tipoVehiculo : "tractores";
  const {
    tractores,
    furgones,
    vehiculos,
    personas,
    stock,
    proveedores,
    ubicaciones,
  } = useData();

  useEffect(() => {
    if (evento.proveedor) setEsServicio(true);
  }, [evento.proveedor]);

  const [formData, setFormData] = useState({
    tipo: evento?.tipo || "",
    chofer: evento?.chofer ? String(evento.chofer) : "",
    //mecanico: evento?.mecanico ? String(evento.mecanico) : "", // mecanico individual
    mecanico: evento?.mecanico
      ? Array.isArray(evento.mecanico)
        ? evento.mecanico
        : [evento.mecanico]
      : [], // 1 o varios mecanico/s
    proveedor: evento?.proveedor ? String(evento.proveedor) : "",
    tractor: evento?.tractor
      ? Array.isArray(elemento.tractor)
        ? elemento.tractor
        : [elemento.tractor]
      : [],
    kilometraje: evento?.kilometraje || "",
    furgon: evento?.furgon
      ? Array.isArray(elemento.furgon)
        ? elemento.furgon
        : [elemento.furgon]
      : [],
    detalle: evento?.detalle || "",
    area: evento?.area || area,
    subarea: evento?.subarea || subarea,
    sucursal: evento?.sucursal ? evento.sucursal : "01",
  });

  const subtiposDisponibles = tiposEventos[area.toUpperCase()];

  const [mecanicos, setMecanicos] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [articulosUsados, setArticulosUsados] = useState([]);
  const [articulosUsadosBackUp, setArticulosUsadosBackUp] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [ingresos, setIngresos] = useState([]); // para el listado de repuestos a usar
  const [uploading, setUploading] = useState(false); // Para evitar doble cargas
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalArticuloVisible, setModalArticuloVisible] = useState(false);
  const [esServicio, setEsServicio] = useState(false);
  const usuarioJSON = JSON.parse(localStorage.usuario); // asumimos que ya lo guardaste
  const esSuperAdmin =
    usuarioJSON?.rol === "superadmin" || usuarioJSON?.rol === "dev";

  useEffect(() => {
    const listadoMecanicos = personas.filter(
      (p) =>
        p.puesto === "TALLER" &&
        (p.estado === true || p.estado === "1" || p.estado === 1)
    );
    setMecanicos(listadoMecanicos);

    const listadoChoferes = personas.filter(
      (p) =>
        (p.especializacion === "LARGA DISTANCIA" &&
          (p.estado === true || p.estado === "1" || p.estado === 1)) ||
        (p.especializacion === "MOVIMIENTO" &&
          (p.estado === true || p.estado === "1" || p.estado === 1)) ||
        (p.especializacion === "FLETERO" &&
          (p.estado === true || p.estado === "1" || p.estado === 1)) ||
        p.especializacion === "FLETERO"
    );
    setChoferes(listadoChoferes);
  }, [personas]);

  useEffect(() => {
    if (ubicaciones && typeof ubicaciones === "object") {
      const opciones = Object.entries(ubicaciones).map(([id, data]) => ({
        value: data.id,
        label: data.nombre,
      }));
      setSucursales(opciones);
    }
  }, [ubicaciones]);

  useEffect(() => {
    const listadoServicios = proveedores.filter((p) => p.id !== "01");
    setServicios(listadoServicios);
  }, [proveedores]);

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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      mecanico: esServicio ? [] : prev.mecanico,
      //proveedor: esServicio ? prev.proveedor : "", // no me cargaba el proveedor
    }));
  }, [esServicio]);
  const handleRestore = () => {
    setArticulosUsados(articulosUsadosBackUp); // restablecer al listado original de firestore
    setIngresos([]); // limpiar ingresos agregados manualmente
  };
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setUploading(true);

    try {
      /*
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
    */

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
        //fecha: elemento?.id ? elemento.fecha : fechaParaGuardar,
        chofer: formData.chofer ? Number(formData.chofer) : null,
        //mecanico: formData.mecanico ? Number(formData.mecanico) : null,
        mecanico: formData?.mecanico
          ? Array.isArray(formData.mecanico)
            ? formData.mecanico.map((m) => Number(m))
            : [Number(formData.mecanico)]
          : [],
        proveedor: formData.proveedor ? String(formData.proveedor) : null,
        subtipo: formData.subtipo?.toUpperCase() || null,
        persona: formData.persona ? Number(formData.persona) : null,
        vehiculo: formData.vehiculo ? Number(formData.vehiculo) : null,
        //tractor: formData.tractor ? Number(formData.tractor) : null,
        tractor: formData.tractor ? formData.tractor.map(Number) : [], // array de internos
        //furgon: formData.furgon ? Number(formData.furgon) : null,
        furgon: formData.furgon ? formData.furgon.map(Number) : [], // array de internos
        kilometraje: formData.kilometraje ? Number(formData.kilometraje) : null,
        area: formData.area || area,
        subarea: formData.subarea || subarea,
        detalle: formData.detalle?.toUpperCase() || null,
        usuario: evento.id ? evento.usuario || usuarioDeCarga : usuarioDeCarga,
        repuestos: repuestos,
        sucursal: formData.sucursal,
      };

      const confirmacion = await Swal.fire({
        title: "Confirmar datos",
        html: `
        <b>Fecha:</b> ${formatearFecha(new Date())}<hr>
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
        return;
      }

      const eventoGuardado = evento.id
        ? await agregarEvento(datosAGuardar, area, evento.id)
        : await agregarEvento(datosAGuardar, area);

      const idEvento = eventoGuardado.id;

      for (const item of listaArticulosFinal) {
        if (item.tipo === "RC" || item.tipo === "RECUPERACION") {
          const codigoRepuesto = item.id;
          const cantidad = item.cantidad;
          const unidad = item.unidad;

          let coleccion = null;
          let idDocu = null;

          if (formData.tractor) {
            coleccion = "tractores";
            idDocu = formData.tractor;
          } else if (formData.furgon) {
            coleccion = "furgones";
            idDocu = formData.furgon;
          } else if (formData.vehiculo) {
            coleccion = "vehiculos";
            idDocu = formData.vehiculo;
          }

          if (coleccion && idDocu) {
            await agregarFaltante(
              coleccion,
              idDocu,
              codigoRepuesto,
              cantidad,
              unidad
            );
          }
        }
      }

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
          </h2>{" "}
          <p>* campo obligatorio</p>
        </div>
        <form onSubmit={handleSubmit} className="modal-formulario-doble">
          <div className="form-left">
            <div className="type-container-small">
              <label>
                Sucursal <InputValidator campo={formData.sucursal} />
                <Select
                  options={sucursales}
                  value={
                    sucursales.find(
                      (s) => s.value === String(formData.sucursal)
                    ) || null
                  }
                  onChange={(opt) =>
                    setFormData({ ...formData, sucursal: opt ? opt.value : "" })
                  }
                  placeholder="Seleccionar sucursal"
                  isClearable
                  isDisabled={!esSuperAdmin}
                  required
                />
              </label>
              <button
                type="button"
                className={
                  !esServicio ? "type-btn positive-active-black" : "type-btn"
                }
                onClick={() => setEsServicio(false)}
              >
                REALIZADO EN TALLER {!esServicio ? " *" : null}
              </button>
              <button
                type="button"
                className={
                  esServicio ? "type-btn positive-active-black" : "type-btn"
                }
                onClick={() => setEsServicio(true)}
              >
                REALIZADO AFUERA {esServicio ? " *" : null}
              </button>
              <InputValidator campo={esServicio} />
            </div>

            <label>
              Tipo * <InputValidator campo={formData.tipo} />
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
            {!esServicio ? (
              <label>
                Mecánico Tipo * <InputValidator campo={formData.mecanico} />
                <div className="select-with-button">
                  <Select
                    className="select-grow"
                    options={mecanicos
                      .map((p) => ({
                        value: p.dni, // usamos DNI como identificador
                        label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
                        apellido: p.apellido,
                      }))
                      .sort((a, b) => a.apellido.localeCompare(b.apellido))}
                    value={
                      formData.mecanico
                        ? (Array.isArray(formData.mecanico)
                            ? formData.mecanico
                            : [formData.mecanico]
                          ).map((dni) =>
                            personas.find((p) => p.dni === dni)
                              ? {
                                  value: dni,
                                  label: `${
                                    personas.find((p) => p.dni === dni).apellido
                                  } ${
                                    personas.find((p) => p.dni === dni).nombres
                                  } (DNI: ${dni})${
                                    !mecanicos.some((m) => m.dni === dni)
                                      ? " [INACTIVO]"
                                      : ""
                                  }`,
                                }
                              : { value: dni, label: `DNI: ${dni} [INACTIVO]` }
                          )
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
            ) : (
              <label>
                Proveedor del servicio Tipo *{" "}
                <InputValidator campo={formData.proveedor} />
                <div className="select-with-button">
                  <Select
                    className="select-grow"
                    options={servicios.map((opt) => ({
                      value: String(opt.id),
                      label:
                        opt.id + " - " + opt.nombre + " (" + opt.marca + ")",
                      cuit: opt.cuit,
                    }))}
                    value={
                      formData.proveedor
                        ? servicios
                            .map((opt) => ({
                              value: String(opt.id),
                              label:
                                opt.id +
                                " - " +
                                opt.nombre +
                                " (" +
                                opt.marca +
                                ")",
                              cuit: opt.cuit,
                            }))
                            .find(
                              (opt) =>
                                String(opt.value) === String(formData.proveedor)
                            )
                        : null
                    }
                    onChange={(opt) =>
                      setFormData({
                        ...formData,
                        proveedor: opt ? opt.value : "",
                      })
                    }
                    placeholder=""
                    isClearable
                    required
                  />
                  <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickPersona}
                  />
                </div>
              </label>
            )}

            {area === "tractores" ? (
              <>
                <div className="doble-select">
                  <label>
                    Tractor * <InputValidator campo={formData.tractor} />
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
                  <label>
                    Kilometraje <InputValidator campo={formData.kilometraje} />
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
                      min="0"
                    />
                  </label>
                </div>
              </>
            ) : null}

            {area === "furgones" ? (
              <>
                <label>
                  Furgon * <InputValidator campo={formData.furgon} />
                  <Select
                    options={furgones.map((t) => ({
                      value: t.id,
                      label: `${t.interno} (${t.dominio})`,
                    }))}
                    value={furgones
                      .map((t) => ({
                        value: t.id,
                        label: `${t.interno} (${t.dominio})`,
                      }))
                      .filter((opt) =>
                        formData.furgon.map(String).includes(opt.value)
                      )}
                    onChange={(opts) =>
                      handleChange({
                        target: {
                          name: "furgon",
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
              </>
            ) : null}

            <label>
              Chofer <InputValidator campo={formData.chofer} />
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
              Detalle <InputValidator campo={formData.detalle} />
              <textarea
                name="detalle"
                value={formData.detalle}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-right">
            <div className={`form-box overflow-visible`}>
              <label>
                Cargar repuesto <InputValidator campo={articuloSeleccionado} />
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
                  Cantidad <InputValidator campo={cantidad} />
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
            <div className={`form-box`}>
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
                            item.detalle
                              ? " | " + item.detalle.toUpperCase()
                              : ""
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
            <InputValidator campo={ingresos} />
            <InputValidator campo={articulosUsados} />
            <div className={`form-box-footer ${esServicio ? "form-null" : ""}`}>
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
          //onGuardar={handleSubmit}
        />
      )}
      {modalPersonaVisible && (
        <FormGestor
          tipo={"persona"}
          onClose={cerrarModalPersona}
          //onGuardar={handleSubmit}
        />
      )}
      {modalArticuloVisible && (
        <FormGestor
          tipo={"stock"}
          onClose={cerrarModalArticulo}
          //onGuardar={handleSubmit}
        />
      )}
    </div>
  );
};

export default FormEventoTaller;

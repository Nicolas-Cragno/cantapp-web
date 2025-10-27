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

  const { tractores, furgones, personas, stock } = useData();

  const [formData, setFormData] = useState({
    tipo: evento?.tipo || "",
    chofer: evento?.chofer ? String(evento.chofer) : "",
    mecanico: evento?.mecanico ? String(evento.mecanico) : "",
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
    const cargarMecanicos = async () => {
      try {
        const data = personas.filter((p) => p.puesto === "MECANICO");
        setMecanicos(data);
      } catch (error) {
        console.error("Error al cargar Mecanicos: ", error);
      }
    };
    const cargarChoferes = async () => {
      try {
        const data = personas.filter(
          (p) =>
            p.puesto === "CHOFER LARGA DISTANCIA" ||
            p.puesto === "CHOFER MOVIMIENTO" ||
            p.puesto === "FLETERO"
        );
        setChoferes(data);
      } catch (error) {
        console.error("Error al carga choferes: ", error);
      }
    };

    if (evento.id && evento.repuestos) {
      setArticulosUsados(
        evento.repuestos.map((r) => ({
          id: r.id,
          descripcion: r.descripcion,
          cantidad: r.cantidad,
          unidad: r.unidad,
        }))
      );
      setArticulosUsadosBackUp(evento.repuestos); // para poder restaurar
    }
    if (articuloSeleccionado) {
      const articulo = stock.find((a) => a.id === articuloSeleccionado);
    }

    cargarMecanicos();
    cargarChoferes();
  }, [evento.id, articuloSeleccionado, stock, evento, personas]);

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
        cantidad: item.cantidad,
        unidad: item.unidad,
      }));

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        subtipo: formData.subtipo?.toUpperCase() || null,
        persona: formData.persona ? Number(formData.persona) : null,
        vehiculo: formData.vehiculo ? Number(formData.vehiculo) : null,
        kilometraje: formData.kilometraje ? Number(formData.kilometraje) : null,
        area: formData.area || area,
        subarea: formData.subarea || subarea,
        detalle: formData.detalle?.toUpperCase() || null,
        usuario: evento.id ? evento.usuario || usuarioDeCarga : usuarioDeCarga,
        repuestos,
      };

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
              Mecanico
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
                    formData.mecanico
                      ? {
                          value: formData.mecanico,
                          label:
                            mecanicos.find((p) => p.id === formData.mecanico)
                              ?.apellido +
                            " " +
                            mecanicos.find((p) => p.id === formData.mecanico)
                              ?.nombres +
                            ` (DNI: ${formData.mecanico})`,
                        }
                      : null
                  }
                  onChange={(opt) =>
                    setFormData({ ...formData, mecanico: opt ? opt.value : "" })
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
                            label: `${t.dominio} (${t.interno})`,
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
                          kilometraje: e ? e.value : 0,
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
            <div className="form-box">
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
                        ).toUpperCase()})`,
                      }))
                      .sort((a, b) => a.label.localeCompare(b.label))}
                    value={
                      articuloSeleccionado
                        ? {
                            value: articuloSeleccionado,
                            label: `${
                              stock.find((a) => a.id === articuloSeleccionado)
                                ?.descripcion || ""
                            } (${
                              stock.find((a) => a.id === articuloSeleccionado)
                                ?.marca || ""
                            })`,
                          }
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
                    <div className="item-info">{item.descripcion}</div>
                    <div className="item-actions">
                      <span className="list-cant">
                        + {item.cantidad} {item.unidad.toUpperCase()}
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

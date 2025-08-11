import { useState, useEffect } from "react";
import "../css/Forms.css";
import {
  agregarEventoTaller,
  listarColeccion,
} from "../../functions/db-functions";
import { singularTipoVehiculo } from "../../functions/data-functions";
import Swal from "sweetalert2";
import {
  formatearFecha,
  formatearHora,
  obtenerNombreUnidad,
} from "../../functions/data-functions";
import tiposEventos from "../../functions/data/eventos.json";

import PlusLogo from "../../assets/logos/pluslogo.png";
import RefreshLogo from "../../assets/logos/refreshlogo.png";
import DropLogo from "../../assets/logos/droplogo.png";

const FormularioEventoTaller = ({
  evento = {},
  tipoVehiculo = null,
  area = null,
  subarea = null,
  tipoPorArea = null,
  onClose,
  onGuardar,
}) => {
  const [formData, setFormData] = useState({
    subtipo: evento.subtipo || "",
    persona: evento.persona ? String(evento.persona) : "",
    vehiculo:
      evento.tractor ||
      evento.furgon ||
      evento.utilitario ||
      evento.vehiculo ||
      "",
    detalle: evento.detalle || "",
    area: evento.area || "",
    subarea: evento.subarea || "",
  });

  const subtiposDisponibles = tiposEventos["TALLER"];

  const [mecanicos, setMecanicos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState("");
  const [articulosUsados, setArticulosUsados] = useState([]);
  const [articulosUsadosBackUp, setArticulosUsadosBackUp] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [ingresos, setIngresos] = useState([]); // para el listado de repuestos a usar
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const cargarMecanicos = async () => {
      try {
        const data = await listarColeccion("personas");
        setMecanicos(data);
      } catch (error) {
        console.error("Error al cargar Mecanicos: ", error);
      }
    };

    const cargarVehiculos = async () => {
      try {
        let data = [];

        const subareaEnUso = evento.subarea
          ? evento.subarea.toUpperCase()
          : tipoVehiculo.toUpperCase();

        switch (subareaEnUso) {
          case "TRACTORES":
            data = await listarColeccion("tractores");
            break;
          case "FURGONES":
            data = await listarColeccion("furgones");
            break;
          default:
            data = await listarColeccion("utilitarios");
            break;
        }

        setVehiculos(data);
      } catch (error) {
        console.error("Error al cargar vehiculos: ", error);
      }
    };

    const cargarArticulos = async () => {
      const data = await listarColeccion("stock", true);
      setArticulos(data);
      setLoading(false);
    };

    const cargarUsoStock = async () => {
      if (evento.id) {
        const listaArticulos = await listarColeccion("stock", true);
        const data = await listarColeccion("usoStock", true);

        const articulosUsados = data
          .filter((uso) => uso.reparacion === evento.id)
          .map((uso) => {
            const articulo = listaArticulos.find(
              (art) => String(art.id) === String(uso.repuesto)
            );

            listaArticulos.forEach((a) => {
              console.log("Artículo ID:", `"${a.id}"`);
            });
            console.log("Buscando repuesto ID:", `"${uso.repuesto}"`);

            return {
              id: uso.repuesto,
              descripcion: articulo?.descripcion || "Artículo no encontrado",
              cantidad: uso.cantidad,
              unidad: articulo?.unidad || "",
            };
          });

        setArticulosUsados(articulosUsados);
        setArticulosUsadosBackUp(articulosUsados); // para restablecer
        setLoading(false);
      }
    };
    cargarMecanicos();
    cargarVehiculos();
    cargarArticulos();
    cargarUsoStock();
  }, []);

  const handleRestore = () => {
    setArticulosUsados(articulosUsadosBackUp); // restablecer al listado original de firestore
    setIngresos([]); // limpiar ingresos agregados manualmente
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let idGuardado;

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

      if (isNaN(fechaParaGuardar.getTime())) {
        throw new Error("La fecha es inválida");
      }

      const usuarioJSON = JSON.parse(localStorage.usuario);
      const usuarioDeCarga =
        usuarioJSON["apellido"] + " " + usuarioJSON["nombres"];

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        subtipo: formData.subtipo ? formData.subtipo.toUpperCase() : null,
        persona: formData.persona ? Number(formData.persona) : null,
        vehiculo: formData.vehiculo ? Number(formData.vehiculo) : null,
        area: formData.area ? formData.area : area, //El area la recibe desde la tabla/ficha
        subarea: formData.subarea ? formData.subarea : subarea,
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,
        usuario: evento.id
          ? evento.usuario
            ? evento.usuario
            : usuarioDeCarga
          : null,
      };

      // Lista final de articulos/repuestos
      const listaArticulosFinal = [...articulosUsados, ...ingresos];

      // Uso de stock: cada elemento será un documento en la colección
      const usoStockAGuardar = listaArticulosFinal.map((item) => ({
        reparacion: evento.id, // Para saber a qué evento pertenece
        repuesto: item.id, // ID del artículo
        cantidad: item.cantidad,
        unidad: item.unidad,
      }));

      if (evento.id) {
        idGuardado = await agregarEventoTaller(
          datosAGuardar,
          usoStockAGuardar,
          evento.id
        );
      } else {
        idGuardado = await agregarEventoTaller(datosAGuardar, usoStockAGuardar);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      console.error("Error al guardar evento:", error);
      onClose();
    }

    Swal.fire({
      title: "Evento guardado  " + idGuardado,
      text: "Se ha completado el registro exitosamente.",
      icon: "success",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#4161bd",
    });
    onClose();
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

    const articulo = articulos.find((a) => a.id === articuloSeleccionado);

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
                        {item.area} - {item.subtipo}
                      </option>
                    ))}
              </select>
            </label>

            <label>
              Mecanico
              <select
                name="persona"
                value={formData.persona}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                {mecanicos.map((p) => (
                  <option key={p.dni} value={p.dni}>
                    {p.apellido} {p.nombres} (DNI: {p.dni})
                  </option>
                ))}
              </select>
            </label>

            <label>
              {evento.subarea
                ? singularTipoVehiculo(evento.subarea)
                : tipoVehiculo
                ? singularTipoVehiculo(tipoVehiculo)
                : "Vehiculo"}
              <select
                type="number"
                name="vehiculo"
                value={formData.vehiculo}
                onChange={handleChange}
              >
                <option value=""></option>
                {vehiculos.map((t) => (
                  <option key={t.interno} value={t.interno}>
                    {t.dominio} ({t.interno})
                  </option>
                ))}
              </select>
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
                <select
                  value={articuloSeleccionado}
                  onChange={(e) => {
                    const idSeleccionado = e.target.value;
                    setArticuloSeleccionado(idSeleccionado);
                    const articulo = articulos.find(
                      (a) => a.id === idSeleccionado
                    );
                    setUnidad(articulo ? articulo.unidad : "");
                  }}
                  disabled={loading}
                >
                  <option value="">Seleccionar...</option>
                  {articulos.map((art) => (
                    <option key={art.id} value={art.id}>
                      {art.id} - {art.descripcion} ({art.marca})
                    </option>
                  ))}
                </select>
              </label>
              <div className="input-inline">
                <label>
                  Cantidad {area}
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
                    value={obtenerNombreUnidad(unidad).toUpperCase()}
                    disabled
                  />
                  <img
                    src={PlusLogo}
                    alt=""
                    onClick={handleAdd}
                    className="plus-logo"
                  ></img>
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
              <button type="submit">Guardar</button>
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEventoTaller;

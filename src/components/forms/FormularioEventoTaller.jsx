import { useState, useEffect } from "react";
import "../css/Forms.css";
import { agregarEvento, listarColeccion } from "../../functions/db-functions";
import Swal from "sweetalert2";
import {
  formatearFecha,
  formatearHora,
  obtenerNombreUnidad,
} from "../../functions/data-functions";
import tiposEventos from "../../functions/data/eventos.json";
import { FaCirclePlus } from "react-icons/fa6";
import { FaPray } from "react-icons/fa";

const FormularioEventoTaller = ({
  evento = {},
  area = null,
  tipoPorArea = null,
  onClose,
  onGuardar,
}) => {
  const [formData, setFormData] = useState({
    subtipo: evento.subtipo || "",
    persona: evento.persona ? String(evento.persona) : "",
    tractor: evento.tractor || "",
    furgon: evento.furgon || "",
    detalle: evento.detalle || "",
    area: evento.area || "",
  });

  const subtiposDisponibles = tiposEventos["TALLER"];

  const [mecanicos, setMecanicos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState("");
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
        if (evento.tractor) {
          data = await listarColeccion("tractores");
        } else if (evento.furgon) {
          data = await listarColeccion("furgones");
        } else {
          data = await listarColeccion("utilitarios");
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

    cargarMecanicos();
    cargarVehiculos();
    cargarArticulos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire("Agregar");
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
    setIngresos((ing) => ing.filter((_, i) => i != indexEliminar));
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
                name="mecanico"
                value={formData.persona}
                onChange={handleChange}
                //required
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
              {evento.tractor
                ? "Tractor"
                : evento.furgon
                ? "Furgon"
                : "Vehiculo"}
              <select
                type="number"
                name="vehiculo"
                value={
                  formData.tractor
                    ? formData.tractor
                    : formData.furgon
                    ? formData.furgon
                    : formData.vehiculo
                }
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
                    value={obtenerNombreUnidad(unidad).toUpperCase()}
                    disabled
                  />
                  <button
                    className="plus-btn"
                    type="button"
                    onClick={handleAdd}
                  >
                    <FaCirclePlus className="plus-logo" />
                  </button>
                </div>
              </div>
            </div>
            <div className="form-box">
              {ingresos.length === 0 ? (
                <p>...</p>
              ) : (
                <ul className="list">
                  {ingresos.map((item, index) => (
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

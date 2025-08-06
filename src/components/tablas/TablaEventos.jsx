import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  listarColeccion,
  buscarNombrePorDni,
} from "../../functions/db-functions";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import FichaEvento from "../fichas/FichaEvento";
import FormularioEvento from "../forms/FormularioEvento";
import "../css/Tables.css";

const TablaEventos = ({
  tipo = null,
  area = null,
  subarea = null,
  tipoPorArea = null,
}) => {
  const [eventos, setEventos] = useState([]);
  const [nombresPorDni, setNombresPorDni] = useState({});
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  // Evita error si 'area' es null
  const title =
    tipo != null && typeof area === "string"
      ? area.toUpperCase()
      : typeof area === "string" && typeof subarea === "string"
      ? area.toUpperCase() + subarea.toUpperCase()
      : "EVENTOS";

  const cargarEventos = async (usarCache = true) => {
    setLoading(true);
    try {
      const datos = await listarColeccion("eventos", usarCache);

      const eventosFiltrados =
        area && typeof area === "string"
          ? datos
              .filter((e) => e.area?.toUpperCase() === area.toUpperCase())
              .filter((e) =>
                subarea && typeof subarea === "string"
                  ? e.subarea?.toUpperCase() === subarea.toUpperCase()
                  : true
              )
          : datos;

      // Ordenar de más nuevo a más viejo
      const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaB - fechaA; // más nuevo primero
      });

      setEventos(eventosOrdenados);

      const dnisUnicos = [
        ...new Set(eventosOrdenados.map((e) => e.persona).filter(Boolean)),
      ];
      const nombresMap = {};

      await Promise.all(
        dnisUnicos.map(async (dni) => {
          const nombreCompleto = await buscarNombrePorDni(dni);
          nombresMap[dni] = nombreCompleto;
        })
      );

      setNombresPorDni(nombresMap);
    } catch (error) {
      console.error("Error al obtener eventos o nombres:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, [tipo, area]);

  const handleClickEvento = (evento) => {
    setEventoSeleccionado(evento);
  };

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  const handleGuardar = async () => {
    await cargarEventos(false);
    setModalAgregarVisible(false);
    setEventoSeleccionado(null);
  };

  const eventosFiltrados = eventos.filter((e) => {
    const fechaTxt = formatearFecha(e.fecha);
    const horaTxt = formatearHora(e.fecha);
    const nombre = nombresPorDni[e.persona] || e.persona || "";
    const textoFiltro = `${e.subtipo || ""} ${nombre} ${e.tractor || ""} ${
      e.furgon || ""
    } ${fechaTxt} ${horaTxt}`;
    return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-title">{title}</h1>
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="table-busqueda"
        />
      </div>

      {loading ? (
        <div className="loading-item">
          <FaSpinner className="spinner" />
        </div>
      ) : (
        <div className="table-scroll-wrapper">
          <table className="table-lista">
            <thead className="table-titles">
              <tr>
                <th>FECHA</th>
                <th>SECTOR</th>
                <th>EVENTO</th>
                <th>EMPLEADO</th>
                <th>TRACTOR</th>
                <th>FURGÓN</th>
              </tr>
            </thead>
          </table>
          <div className="table-body-wrapper">
            <table className="table-lista">
              <tbody className="table-body">
                {eventosFiltrados.map((evento) => (
                  <tr
                    key={evento.id}
                    onClick={() => handleClickEvento(evento)}
                    className="table-item"
                  >
                    <td>
                      {formatearFecha(evento.fecha)} -{" "}
                      {formatearHora(evento.fecha)} HS
                    </td>
                    <td>{evento.area}</td>
                    <td>{evento.subtipo}</td>
                    <td>
                      {evento.persona
                        ? nombresPorDni[evento.persona] || evento.persona
                        : ""}
                    </td>
                    <td>{evento.tractor ? evento.tractor : ""}</td>
                    <td>{evento.furgon ? evento.furgon : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {eventoSeleccionado && (
        <FichaEvento
          evento={eventoSeleccionado}
          onClose={cerrarModal}
          onGuardar={handleGuardar}
        />
      )}

      {modalAgregarVisible && (
        <FormularioEvento
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
          area={typeof area === "string" ? area.toUpperCase() : ""}
          tipoPorArea={tipoPorArea}
        />
      )}

      <div className="table-options">
        <button
          className="table-agregar"
          onClick={() => setModalAgregarVisible(true)}
        >
          + AGREGAR
        </button>
      </div>
    </section>
  );
};

export default TablaEventos;

import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion, buscarNombrePorDni } from "../../functions/db-functions"; 
import { formatearFecha } from "../../functions/data-functions";
import FichaEvento from "../fichas/FichaEvento";
import FormularioEvento from "../forms/FormularioEvento";
import "../css/Tables.css";

const TablaEventos = ({ tipo = null, area = null, tipoPorArea = null }) => {
  const [eventos, setEventos] = useState([]);
  const [nombresPorDni, setNombresPorDni] = useState({});
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  const title = tipo != null ? area.toUpperCase() : "EVENTOS";

  const cargarEventos = async () => {
    setLoading(true);
    try {
      const datos = await listarColeccion("eventos");
      const eventosFiltrados = tipo != null
        ? datos.filter(e => e.area === area.toUpperCase())
        : datos;
      setEventos(eventosFiltrados);

      const dnisUnicos = [...new Set(eventosFiltrados.map(e => e.persona).filter(Boolean))];
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

  // Abrir detalle evento
  const handleClickEvento = (evento) => {
    setEventoSeleccionado(evento);
  };

  // Cerrar detalle o formulario
  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  // Recargar lista después de guardar evento
  const handleGuardar = async () => {
    await cargarEventos();
    setModalAgregarVisible(false);
    setEventoSeleccionado(null);
  };

  const eventosFiltrados = eventos.filter((e) => {
    const fechaTxt = formatearFecha(e.fecha);
    const nombre = nombresPorDni[e.persona] || e.persona || "";
    const textoFiltro = `${e.subtipo || ""} ${nombre} ${e.tractor || ""} ${e.furgon || ""} ${fechaTxt}`;
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

      <ul className="table-lista">
        {loading ? (
          <li className="loading-item"><FaSpinner className="spinner" /></li>
        ) : eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento) => (
            <li
              key={evento.id}
              className="table-item"
              onClick={() => handleClickEvento(evento)}
            >
              <span className="table-nombre">{evento.subtipo}</span>
              <span className="table-info">{nombresPorDni[evento.persona] || evento.persona}</span>
              <span className="table-info">Tractor: {evento.tractor}</span>
              <span className="table-info">Furgón: {evento.furgon}</span>
              <span className="table-info">{formatearFecha(evento.fecha)}</span>
            </li>
          ))
        ) : (
          <li className="table-item">No se encontraron eventos</li>
        )}
      </ul>

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
          area={area.toUpperCase()}
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

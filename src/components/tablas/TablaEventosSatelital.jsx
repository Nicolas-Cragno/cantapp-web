import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import AlertButton from "../buttons/AlertButton";
import areas from "../../functions/data/areas.json";
import {
  listarColeccion,
  buscarNombrePorDni,
  useDetectarActualizaciones,
} from "../../functions/db-functions";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import FichaEvento from "../fichas/FichaEventoSatelital";
import FormularioEvento from "../forms/FormularioEventoSatelital";
import LogoSatelital from "../../assets/logos/logosatelital-w.png";
import "./css/Tables.css";

const TablaEventosSatelital = () => {
  const area = "satelital";
  const [eventos, setEventos] = useState([]);
  const [nombresPorDni, setNombresPorDni] = useState({});
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const { hayActualizacion, marcarComoActualizado } =
    useDetectarActualizaciones("eventos", {
      campo: "area",
      valor: area ? area.toLowerCase() : null,
    });

  const cargarEventos = async (usarCache = true) => {
    setLoading(true);
    try {
      const datos = await listarColeccion("eventos", usarCache);

      const eventosFiltrados =
        area && typeof area === "string"
          ? datos.filter((e) => e.area?.toLowerCase() === area.toLowerCase())
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
  }, [area]);

  const handleClickEvento = (evento) => {
    setEventoSeleccionado(evento);
  };

  const actualizarDatos = async () => {
    await cargarEventos(false);
    marcarComoActualizado();
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
    } ${fechaTxt} ${horaTxt} ${e.usuario || ""}`;
    return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoSatelital} alt="" className="table-logo" />
          Satelital
        </h1>
        {hayActualizacion && <AlertButton onClick={actualizarDatos} />}
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
                <th>#</th>
                <th>FECHA</th>
                <th>TIPO</th>
                <th>EMPLEADO</th>
                <th>TRACTOR</th>
                <th>FURGÓN</th>
                <th>CARGA</th>
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
                    <td>{evento.id}</td>
                    <td>
                      {formatearFecha(evento.fecha)} -{" "}
                      {formatearHora(evento.fecha)} HS
                    </td>
                    <td>{evento.tipo}</td>
                    <td>
                      {evento.persona
                        ? nombresPorDni[evento.persona] || evento.persona
                        : ""}
                    </td>
                    <td>{evento.tractor ? evento.tractor : ""}</td>
                    <td>{evento.furgon ? evento.furgon : ""}</td>
                    <td>{evento.usuario ? evento.usuario : ""}</td>
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
          area={typeof area === "string" ? area.toLowerCase() : null}
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

export default TablaEventosSatelital;

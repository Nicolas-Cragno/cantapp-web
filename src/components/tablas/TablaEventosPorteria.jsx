import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import AlertButton from "../buttons/AlertButton";
import {
  listarColeccion,
  buscarNombrePorDni,
  useDetectarActualizaciones,
} from "../../functions/db-functions";
import { IoKeySharp } from "react-icons/io5";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import FichaEventoPorteria from "../fichas/FichaEventoPorteria";
import FichaLlavePorteria from "../fichas/FichaLlavePorteria";
import FormularioEventoPorteria from "../forms/FormularioEventoPorteria";
import FormularioLlavePorteria from "../forms/FormularioLlavePorteria";
import "./css/Tables.css";
import LogoPorteria from "../../assets/logos/logoporteria-w.png";

const TablaEventosPorteria = () => {
  const area = "porteria";
  const [eventos, setEventos] = useState([]);
  const [nombresPorDni, setNombresPorDni] = useState({});
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const { hayActualizacion, marcarComoActualizado } =
    useDetectarActualizaciones("eventos", {
      campo: "area",
      valor: area ? area.toUpperCase() : null,
    });

  const cargarEventos = async (usarCache = true) => {
    setLoading(true);
    try {
      const datos = await listarColeccion("eventos", usarCache);

      const eventosFiltrados =
        area && typeof area === "string"
          ? datos.filter((e) => e.area?.toUpperCase() === area.toUpperCase())
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

  const actualizarDatos = async () => {
    await cargarEventos(false);
    marcarComoActualizado();
  };

  const handleClickEvento = (evento) => {
    setEventoSeleccionado(evento);
  };

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };
  const cerrarModalKey = () => {
    setModalKeyVisible(false);
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
        <h1 className="table-logo-box">
          <img src={LogoPorteria} alt="" className="table-logo" />
          Porteria
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
                    <td>{evento.usuario ? evento.usuario : ""} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {eventoSeleccionado &&
        (eventoSeleccionado.subtipo === "LLAVE-RETIRA" ||
        eventoSeleccionado.subtipo === "LLAVE-DEJA" ? (
          <FichaLlavePorteria
            evento={eventoSeleccionado}
            onClose={cerrarModal}
            onGuardar={handleGuardar}
          />
        ) : (
          <FichaEventoPorteria
            evento={eventoSeleccionado}
            onClose={cerrarModal}
            onGuardar={handleGuardar}
          />
        ))}

      {modalAgregarVisible && (
        <FormularioEventoPorteria
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
        />
      )}

      {modalKeyVisible && (
        <FormularioLlavePorteria
          onClose={cerrarModalKey}
          onGuardar={handleGuardar}
        />
      )}

      <div className="table-options">
        <button
          className="table-agregar"
          onClick={() => setModalKeyVisible(true)}
        >
          <IoKeySharp className="button-logo" />
        </button>
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

export default TablaEventosPorteria;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import AlertButton from "../buttons/AlertButton";
import {
  listarColeccion,
  listarColeccionLimitada,
  buscarNombrePorDni,
  buscarNombrePorDniAbreviado,
  useDetectarActualizaciones,
} from "../../functions/db-functions";
import {
  formatearFecha,
  formatearFechaCorta,
  formatearHora,
} from "../../functions/data-functions";
import FichaViaje from "../fichas/FichaViaje";
import "./css/Tables.css";
// import LogoViaje from "../../assets/logos/logoViajes.png";
import { FaRoute as LogoViaje } from "react-icons/fa";

import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import FormularioViaje from "../forms/FormularioViaje";

const TablaViajes = () => {
  const area = "trafico";
  const [eventos, setEventos] = useState([]);
  const [nombresPorDni, setNombresPorDni] = useState({});
  const [nombresAbreviados, setNombresAbreviados] = useState({});
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const { hayActualizacion, marcarComoActualizado } =
    useDetectarActualizaciones("eventos", {
      campo: "area",
      valor: area ? area.toUpperCase() : null,
    });

  const cargarEventos = async (usarCache = true) => {
    setLoading(true);
    try {
      // const datos = await listarColeccion("eventos", usarCache);
      const datos = await listarColeccionLimitada("eventos", 100, usarCache);
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
      const nombresMapAb = {};

      await Promise.all(
        dnisUnicos.map(async (dni) => {
          const nombreCompleto = await buscarNombrePorDni(dni);
          const nombreAbreviado = await buscarNombrePorDniAbreviado(dni);
          nombresMap[dni] = nombreCompleto;
          nombresMapAb[dni] = nombreAbreviado;
        })
      );

      setNombresPorDni(nombresMap);
      setNombresAbreviados(nombresMapAb);
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
  const handleGuardar = async () => {
    await cargarEventos(false);
    setModalAgregarVisible(false);
    setEventoSeleccionado(null);
  };

  const eventosFiltrados = eventos.filter((e) => {
    const fechaTxt = formatearFecha(e.fecha);
    const horaTxt = formatearHora(e.fecha);
    const nombre = nombresPorDni[e.chofer] || e.chofer || "";
    const textoFiltro = ` ${nombre} ${e.tractor || ""} ${
      e.furgon || ""
    } ${fechaTxt} ${horaTxt} ${e.tipo || ""}`;
    return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          {/* <img src={LogoViaje} alt="" className="table-logo" /> */}
          <LogoViaje />
          CONTROL DE VIAJES & COMBUSTIBLE
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
                <th className="only-cel-off">FECHA</th>

                <th className="only-cel-off">CHOFER</th>
                <th className="only-cel-off">TRACTOR</th>
                <th className="only-cel-off">PROMEDIO</th>
                <th className="only-desktop">DIFERENCIA</th>
                <th className="only-desktop">ESTADO</th>
                <th className="only-cel-on">DETALLE</th>
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
                    <td className="only-cel-off">
                      {formatearFecha(evento.fecha)} -{" "}
                      {formatearHora(evento.fecha)} HS
                    </td>

                    <td className="only-cel-off">
                      {evento.chofer
                        ? nombresPorDni[evento.chofer] || evento.chofer
                        : ""}
                    </td>
                    <td className="only-cel-off">
                      {Array.isArray(evento.tractor)
                        ? evento.tractor.join(", ")
                        : evento.tractor || ""}
                    </td>
                    <td className="only-cel-off">
                      {evento.promedio ? evento.promedio : null}
                    </td>
                    <td className="only-cel-off">
                      {evento.diferencia ? evento.diferencia : null}
                    </td>
                    <td className="only-cel-off">
                      {eventos.estado === true ? "ok" : "a"}
                    </td>
                    <td className="only-cel-on">
                      {/* Figura SOLO en celulares*/}{" "}
                      <strong>{formatearFechaCorta(evento.fecha)}</strong>
                      {"-"}
                      {evento.chofer
                        ? nombresAbreviados[evento.chofer] || evento.chofer
                        : ""}{" "}
                      (Tr.{" "}
                      {Array.isArray(evento.tractor)
                        ? evento.tractor.length > 1
                          ? `${evento.tractor[0]}...`
                          : evento.tractor[0] || ""
                        : evento.tractor || ""}
                      )
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {eventoSeleccionado && (
        <FichaViaje viaje={eventoSeleccionado} onClose={cerrarModal} />
      )}

      {modalAgregarVisible && (
        <FormularioViaje
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
        />
      )}

      <div className="table-options">
        <Link to="/furgones">
          <button className="table-agregar">
            <img src={LogoFurgon} alt="" className="table-logo2" />
          </button>
        </Link>
        <Link to="/tractores">
          <button className="table-agregar">
            <img src={LogoTractor} alt="" className="table-logo2" />
          </button>
        </Link>
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

export default TablaViajes;

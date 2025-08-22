import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  listarColeccion,
  buscarNombrePorDni,
} from "../../functions/db-functions";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import FichaEventoTaller from "../fichas/FichaEventoTaller";
import FormularioEventoTaller from "../forms/FormularioEventoTaller";
import "./css/Tables.css";
import LogoDefault from "../../assets/logos/logotruck-back.png";
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logofurgon-w.png";
import LogoUtilitario from "../../assets/logos/logoutilitario-w.png";

const TablaEventosTaller = ({
  tipo = null,
  area = null,
  subarea = null,
  tipoPorArea = null,
  logo = null,
}) => {
  const [eventos, setEventos] = useState([]);
  const [nombresPorDni, setNombresPorDni] = useState({});
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [dominioTractores, setDominioTractores] = useState({});
  const [dominioFurgones, setDominioFurgones] = useState({});
  const [dominioVehiculos, setDominioVehiculos] = useState({});

  // Evita error si 'area' es null
  logo = logo ? logo : LogoDefault;
  const title =
    tipo != null && typeof area === "string" && typeof subarea === "string"
      ? area.toUpperCase() + " " + subarea.toUpperCase()
      : typeof area === "string"
      ? area.toUpperCase()
      : "REGISTRO TALLER";
  const subtitle = "HISTORIAL DE TRABAJOS";

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

      switch (subarea) {
        case "tractores":
          const dTractores = await listarColeccion("tractores");
          const dominioT = {};
          dTractores.forEach((t) => {
            dominioT[t.interno] = t.dominio;
          });
          setDominioTractores(dominioT);

          break;
        case "furgones":
          const dFurgones = await listarColeccion("furgones");
          const dominioF = {};
          dFurgones.forEach((f) => {
            dominioF[f.interno] = f.dominio;
          });
          setDominioFurgones(dominioF);
          break;
        default:
          const dVehiculos = await listarColeccion("utilitarios");
          const dominioV = {};
          dVehiculos.forEach((v) => {
            dominioV[v.interno] = v.dominio;
          });
          setDominioVehiculos(dominioV);
          break;
      }

      setNombresPorDni(nombresMap);
    } catch (error) {
      console.error("Error al obtener eventos o nombres:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, [tipo, area, subarea]);

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
    let dominioFiltro;
    let internoFiltro;
    switch (subarea) {
      case "tractores":
        internoFiltro = e.tractor;
        dominioFiltro = dominioTractores[e.tractor];
        break;
      case "furgones":
        internoFiltro = e.furgon;
        dominioFiltro = dominioFurgones[e.furgon];
        break;
      default:
        internoFiltro = e.vehiculo;
        dominioFiltro = dominioVehiculos[e.vehiculo];
        break;
    }

    const textoFiltro = `${e.subtipo || ""} ${nombre} ${internoFiltro || ""} ${
      dominioFiltro || ""
    } ${fechaTxt} ${horaTxt} ${e.parte}`;
    return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img
            src={
              title === "TALLER TRACTORES"
                ? LogoTractor
                : title === "TALLER FURGONES"
                ? LogoFurgon
                : LogoUtilitario
            }
            alt=""
            className="table-logo"
          />
          {title}
        </h1>
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
                <th>INTERNO</th>
                <th>MECANICO</th>
                <th>TIPO</th>
                <th>AREA DE TRABAJO</th>
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
                    <td>
                      {evento.subarea === "TRACTORES" && evento.tractor
                        ? evento.tractor +
                          " - " +
                          `${dominioTractores[evento.tractor]}`
                        : evento.subarea === "FURGONES" && evento.furgon
                        ? evento.furgon +
                          " - " +
                          `${dominioFurgones[evento.furgon]}`
                        : `${dominioVehiculos[evento.vehiculo]}`}
                    </td>
                    <td>
                      {evento.persona
                        ? nombresPorDni[evento.persona] || evento.persona
                        : ""}
                    </td>
                    <td>{evento.subtipo}</td>
                    <td>{evento.parte}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {eventoSeleccionado && (
        <FichaEventoTaller
          evento={eventoSeleccionado}
          tipoVehiculo={subarea}
          onClose={cerrarModal}
          onGuardar={handleGuardar}
        />
      )}

      {modalAgregarVisible && (
        <FormularioEventoTaller
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
          tipoVehiculo={subarea}
          area={typeof area === "string" ? area.toUpperCase() : ""}
          subarea={typeof subarea === "string" ? subarea.toUpperCase() : ""}
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

export default TablaEventosTaller;

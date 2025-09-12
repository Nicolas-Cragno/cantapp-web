// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TablaColeccion from "../../components/tablas/TablaColeccion";
import {
  formatearFecha,
  formatearHora,
  buscarPersona,
  colorPromedio,
  colorBatman,
  buscarDominio,
} from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- elementos
import FormularioViaje from "../../components/forms/FormularioViaje";
import FichaViaje from "../../components/fichas/FichaViaje";

// ----------------------------------------------------------------------- visuales, logos, etc
import { FaSpinner } from "react-icons/fa";
import LogoViaje from "../../assets/logos/tripoilLogo.png";
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";

const Viajes = () => {
  const { eventos, personas, tractores, loading } = useData();
  const [filtro, setFiltro] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  const columnasViajes = [
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFecha(v) + " - " + formatearHora(v) + " hs",
    },
    {
      titulo: "CHOFER",
      campo: "chofer",
      render: (dni, item) => buscarPersona(personas, dni),
    },
    {
      titulo: "TRACTOR",
      campo: "tractor",
      render: (v) =>
        Array.isArray(v)
          ? v
              .map(
                (interno) => `${interno} (${buscarDominio(interno, tractores)})`
              )
              .join(", ")
          : `${v} (${buscarDominio(v, tractores)})`,
    },
    {
      titulo: "PROMEDIO",
      campo: "promedio",
      render: (v) =>
        v !== undefined && v !== null ? (
          <span style={{ color: colorPromedio(v) }}>
            <strong>{Number(v).toFixed(2)}</strong>
          </span>
        ) : (
          ""
        ),
    },
    {
      titulo: "DIFERENCIA",
      campo: "diferencia",
      render: (v) =>
        v !== undefined && v !== null ? (
          <span style={{ color: colorBatman(v) }}>
            <strong>{Number(v).toFixed(2)}</strong>
          </span>
        ) : (
          ""
        ),
    },
  ];

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };
  const handleGuardar = async () => {
    setModalAgregarVisible(false);
    setEventoSeleccionado(null);
  };

  const eventosFiltrados = useMemo(() => {
    let filtrados = eventos.filter((e) => e.tipo?.toUpperCase() === "VIAJE");

    filtrados = filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return filtrados.filter((e) => {
      const fechaTxt = formatearFecha(e.fecha);
      const horaTxt = formatearHora(e.fecha);
      const chofer = personas.find((p) => p.dni === e.chofer);
      const nombre = chofer
        ? `${chofer.apellido} ${chofer.nombres}`
        : e.chofer || "";
      const textoFiltro = ` ${nombre} ${e.tractor || ""} ${
        e.furgon || ""
      } ${fechaTxt} ${horaTxt} ${e.tipo || ""}`;
      return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
    });
  }, [eventos, personas, filtro]);

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoViaje} alt="" className="table-logo" />
          CONTROL DE VIAJES & COMBUSTIBLE
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
        <TablaColeccion
          columnas={columnasViajes}
          datos={eventosFiltrados}
          onRowClick={(evento) => setEventoSeleccionado(evento)}
        />
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

export default Viajes;

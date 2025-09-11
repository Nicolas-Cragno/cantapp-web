import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useData } from "../../context/DataContext";
import TablaColeccion from "./TablaColeccion";
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";
import FichaViaje from "../fichas/FichaViaje";
import "./css/Tables.css";
// import LogoViaje from "../../assets/logos/logoViajes.png";
import { FaRoute as LogoViaje } from "react-icons/fa";

import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import FormularioViaje from "../forms/FormularioViaje";

const TablaViajes = () => {
  const { eventos, personas, loading } = useData();
  const [filtro, setFiltro] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  const columnasViajes = [
    { titulo: "FECHA", campo: "fecha", render: (v) => formatearFecha(v) },
    { titulo: "HORA", campo: "fecha", render: (v) => formatearHora(v) },
    { titulo: "CHOFER", campo: "chofer" }, // si querés, podés pasar un render para nombre completo
    {
      titulo: "TRACTOR",
      campo: "tractor",
      render: (v) => (Array.isArray(v) ? v.join(", ") : v),
    },
    { titulo: "PROMEDIO", campo: "promedio" },
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
          {/* <img src={LogoViaje} alt="" className="table-logo" /> */}
          <LogoViaje />
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

export default TablaViajes;

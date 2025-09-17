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
  buscarEmpresa,
} from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- elementos
import FichaEventoPorteria from "../../components/fichas/FichaEventoPorteria";
import FichaLlavePorteria from "../../components/fichas/FichaLlavePorteria";
import FormularioEventoPorteria from "../../components/forms/FormularioEventoPorteria";
import FormularioLlavePorteria from "../../components/forms/FormularioLlavePorteria";

import ModalVehiculo from "../../components/modales/ModalVehiculo";
import ModalPersona from "../../components/modales/ModalPersona";

// ----------------------------------------------------------------------- visuales, logos, etc
import { FaSpinner } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import LogoPorteria from "../../assets/logos/logoporteria-w.png";
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoPersona from "../../assets/logos/logopersonal-w.png";

const Movimientos = () => {
  const AREA = "porteria";
  const { eventos, personas, empresas, tractores, furgones, loading } =
    useData();
  const [filtro, setFiltro] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);

  const columnasPorteria = [
    {
      titulo: "#",
      campo: "id",
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFecha(v) + " - " + formatearHora(v) + " hs",
    },
    {
      titulo: "TIPO",
      campo: "tipo",
    },
    {
      titulo: "PERSONA",
      campo: "persona",
      render: (p) => buscarPersona(personas, p),
    },
    {
      titulo: "EMPRESA",
      campo: "servicio",
      render: (s) => buscarEmpresa(empresas, s),
    },
    {
      titulo: "TRACTOR",
      campo: "tractor",
      render: (t) => {
        if (!t) return ""; // si es null, undefined o ""

        if (Array.isArray(t)) {
          if (t.length === 0) return "";
          return t.join(", "); // une los elementos con coma
        }

        return t; // si es string, lo devuelve directo
      },
    },

    {
      titulo: "FURGÓN",
      campo: "furgon",
    },
    {
      titulo: "CARGA",
      campo: "operador",
      render: (p) => buscarPersona(personas, p, false),
    },
  ];

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };
  const cerrarModalKey = () => {
    setModalKeyVisible(false);
  };

  const cerrarModalTractor = () => {
    setModalTractorVisible(false);
  };

  const cerrarModalFurgon = () => {
    setModalFurgonVisible(false);
  };

  const cerrarModalPersona = () => {
    setModalPersonaVisible(false);
  };

  const cerrarModalStock = () => {
    setModalStockVisible(false);
  };

  const handleGuardar = async () => {
    setModalAgregarVisible(false);
    setEventoSeleccionado(null);
  };

  const eventosFiltrados = useMemo(() => {
    let filtrados = eventos.filter((e) => e.area === AREA);

    filtrados = filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return filtrados.filter((e) => {
      const fechaTxt = formatearFecha(e.fecha);
      const horaTxt = formatearHora(e.fecha);
      const nombre = buscarPersona(personas, e.persona) || e.persona || "";
      const operador = buscarPersona(personas, e.operador) || e.operador || "";
      const textoFiltro = `${e.subtipo || ""} ${nombre} ${e.tractor || ""} ${
        e.furgon || ""
      } ${fechaTxt} ${horaTxt} ${e.tipo || ""} ${e.usuario} ${
        e.operador
      } ${operador}`;
      return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
    });
  });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoPorteria} alt="" className="table-logo" />
          Porteria
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
          columnas={columnasPorteria}
          datos={eventosFiltrados}
          onRowClick={(evento) => setEventoSeleccionado(evento)}
        />
      )}

      {eventoSeleccionado &&
        (eventoSeleccionado.tipo === "RETIRA" ||
        eventoSeleccionado.tipo === "ENTREGA" ? (
          <FichaLlavePorteria
            elemento={eventoSeleccionado}
            onClose={cerrarModal}
            onGuardar={handleGuardar}
          />
        ) : (
          <FichaEventoPorteria
            elemento={eventoSeleccionado}
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

      {modalTractorVisible && (
        <ModalVehiculo
          coleccion={tractores}
          tipo={"tractores"}
          onClose={cerrarModalTractor}
        />
      )}

      {modalPersonaVisible && <ModalPersona onClose={cerrarModalPersona} />}

      {modalFurgonVisible && (
        <ModalVehiculo
          coleccion={furgones}
          tipo={"furgones"}
          onClose={cerrarModalFurgon}
        />
      )}

      <div className="table-options">
        <div className="table-options-group">
          <button
            className="table-agregar"
            onClick={() => setModalFurgonVisible(true)}
          >
            <img src={LogoFurgon} alt="" className="table-logo2" />
          </button>
          <button
            className="table-agregar"
            onClick={() => setModalTractorVisible(true)}
          >
            <img src={LogoTractor} alt="" className="table-logo2" />
          </button>
          <button
            className="table-agregar"
            onClick={() => setModalPersonaVisible(true)}
          >
            <img src={LogoPersona} alt="" className="table-logo2" />
          </button>
        </div>
        <div className="table-options-group">
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
      </div>
    </section>
  );
};

export default Movimientos;

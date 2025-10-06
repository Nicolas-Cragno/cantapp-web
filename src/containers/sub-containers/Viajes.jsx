// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TablaColeccion from "../../components/tablas/TablaColeccion";
import TextButton from "../../components/buttons/TextButton";
import LogoButton from "../../components/buttons/LogoButton";
import {
  formatearFecha,
  formatearFechaCorta,
  formatearHora,
  buscarPersona,
  buscarEmpresa,
  buscarDominio,
} from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- elementos
import FichaGestor from "../../components/fichas/FichaGestor";
import FormGestor from "../../components/forms/FormGestor";
import ModalVehiculo from "../../components/modales/ModalVehiculo";
import ModalPersona from "../../components/modales/ModalPersona";

// ----------------------------------------------------------------------- elementos
import { FaSpinner } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import LogoViaje from "../../assets/logos/logo.svg"; //crear
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoPersona from "../../assets/logos/logopersonal-w.png";

const Viajes = () => {
  const AREA = "trafico";
  const { eventos, personas, empresas, tractores, furgones, loading } =
    useData();
  const [filtro, setFiltro] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);

  const columnasViajes = [
    {
      titulo: "#",
      campo: "id",
      offresponsive: true,
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFechaCorta(v),
      onresponsive: true,
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFecha(v),
      offresponsive: true,
    },
    {
      titulo: "TIPO",
      campo: "tipo",
    },
    {
      titulo: "CHOFER",
      campo: "chofer",
      render: (p) => buscarPersona(personas, p),
      offresponsive: true,
    },
    {
      titulo: "CHOFER",
      campo: "chofer",
      render: (p) => buscarPersona(personas, p, false),
      onresponsive: true,
    },
    {
      titulo: "TRACTOR",
      campo: "tractor",
      render: (t) => `${t} (${buscarDominio(t, tractores)})`,
    },
    {
      titulo: "FURGON", //dejo preparado para cuando se puedan ir cargando los furgones
      campo: "furgon",
      render: (f, fila) => {
        const valor = fila.furgon;

        if (!valor) return "";

        if (Array.isArray(valor)) {
          return valor.length ? valor.join(", ") : "";
        }

        return valor;
      },
      offresponsive: true,
    },
    {
      titulo: "CARGA",
      campo: "operador",
      render: (p) => buscarPersona(personas, p, false),
      offresponsive: true,
    },
  ];

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(null);
  };
  const cerrarModalTractor = () => {
    setModalTractorVisible(null);
  };
  const cerrarModalFurgon = () => {
    setModalFurgonVisible(false);
  };
  const cerrarModalPersona = () => {
    setModalPersonaVisible(false);
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
      const nombre = buscarPersona(personas, e.chofer) || e.chofer || "";
      const operador = buscarPersona(personas, e.operador) || e.operador || "";
      const servicio = buscarEmpresa(empresas, e.servicio) || e.servicio || "";
      const tractorDominio = buscarDominio(e.tractor, tractores);
      const furgonDominio = buscarDominio(e.furgon, furgones);
      const textoFiltro = `${e.subtipo || ""} ${nombre} ${e.tractor || ""} ${
        e.furgon || ""
      } ${fechaTxt} ${horaTxt} ${e.tipo || ""} ${e.usuario} ${
        e.operador
      } ${operador} ${servicio} ${
        e.vehiculo
      } ${tractorDominio} ${furgonDominio} ${e.persona} ${e.servicio}`;
      return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
    });
  });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoViaje} alt="" className="table-logo" /> Control
          Combustible
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
        <FichaGestor
          tipo={eventoSeleccionado.tipo}
          elemento={eventoSeleccionado}
          onClose={cerrarModal}
          onGuardar={handleGuardar}
        />
      )}
    </section>
  );
};

export default Viajes;

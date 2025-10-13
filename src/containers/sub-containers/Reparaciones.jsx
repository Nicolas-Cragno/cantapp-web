// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TablaColeccion from "../../components/tablas/TablaColeccion";
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
// import FichaEventoTaller from "../../components/fichas/FichaEventoTaller";
import FichaLlave from "../../components/fichas/FichaLlave";
// import FormularioEventoTaller from "../../components/forms/FormularioEventoTaller"
import ModalVehiculo from "../../components/modales/ModalVehiculo";
import FormLlave from "../../components/forms/FormLlave";

// ----------------------------------------------------------------------- visuales, logos, etc
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoDefault from "../../assets/logos/logo.svg";

const Reparaciones = ({ filtroSector = "tractores" }) => {
  const AREA = filtroSector;
  const { eventos, personas, empresas, tractores, furgones, loading } =
    useData();
  const [filtro, setFiltro] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);

  const columnasTractores = [
    {
      titulo: "#",
      campo: "id",
      offresponsive: true,
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFecha(v) + " - " + formatearHora(v) + " hs",
      offresponsive: true,
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFechaCorta(v),
      onresponsive: true,
    },
    {
      titulo: "TIPO",
      campo: "tipo",
      render: (v) => v.toUpperCase(),
    },
    {
      titulo: "MECANICO",
      campo: "mecanico",
      render: (p, fila) => {
        const valor =
          fila.mecanico !== null ? buscarPersona(personas, fila.mecanico) : "";

        if (!valor) return "";

        return valor;
      },
      offresponsive: true,
    },
    {
      titulo: "MEC",
      campo: "mecanico",
      render: (p, fila) => {
        const valor =
          fila.mecanico !== null
            ? buscarPersona(personas, fila.mecanico, false)
            : "";

        if (!valor) return "";

        return valor;
      },
      onresponsive: true,
    },
    {
      titulo: "INT",
      campo: "tractor",
      render: (t, fila) => {
        const valor = fila.tractor;

        if (!valor) return "";

        if (Array.isArray(valor)) {
          return valor.length ? valor.join(", ") : "";
        }

        return valor;
      },
    },
    {
      titulo: "CHOFER",
      campo: "chofer",
      render: (p, fila) => {
        const valor =
          fila.chofer !== null ? buscarPersona(personas, fila.chofer) : "";

        if (!valor) return "";

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
          <img
            src={
              AREA === "tractores"
                ? LogoTractor
                : AREA === "furgones"
                ? LogoFurgon
                : LogoDefault
            }
            alt=""
            className="table-logo"
          />
          TALLER {AREA.toUpperCase()}
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
          columnas={columnasTractores}
          datos={eventosFiltrados}
          onRowClick={(evento) => setEventoSeleccionado(evento)}
        />
      )}

      {eventoSeleccionado &&
        (eventoSeleccionado.tipo === "RETIRA" ||
        eventoSeleccionado.tipo === "ENTREGA" ? (
          <FichaGestor
            tipo={"llave"}
            elemento={eventoSeleccionado}
            onClose={cerrarModal}
            onGuardar={handleGuardar}
          />
        ) : eventoSeleccionado.tipo === "REPARACION" ||
          eventoSeleccionado.tipo === "reparacion" ? (
          <FichaGestor
            tipo={AREA}
            filtroVehiculo={AREA}
            elemento={eventoSeleccionado}
            onClose={cerrarModal}
            onGuardar={handleGuardar}
          />
        ) : null)}

      {modalAgregarVisible &&
        {
          /* agregar eventotaller */
        }}

      {modalKeyVisible && (
        <FormLlave
          sector="tractores"
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

      {modalFurgonVisible && (
        <ModalVehiculo
          coleccion={furgones}
          tipo={"furgones"}
          onClose={cerrarModalFurgon}
        />
      )}

      <div className="table-options">
        <div className="table-options-group">
          {AREA === "tractores" ? (
            <button
              className="table-agregar"
              onClick={() => setModalTractorVisible(true)}
            >
              <img src={LogoTractor} alt="" className="table-logo2" />
            </button>
          ) : AREA == "furgones" ? (
            <button
              className="table-agregar"
              onClick={() => setModalFurgonVisible(true)}
            >
              <img src={LogoFurgon} alt="" className="table-logo2" />
            </button>
          ) : null}
        </div>
        <div className="table-options-group">
          <button
            className="table-agregar"
            onClick={() => setModalKeyVisible(true)}
          >
            <IoKeySharp className="button-logo" />
          </button>
          {/*
          <button
            className="table-agregar"
            onClick={() => setModalAgregarVisible(true)}
          >
            + AGREGAR
          </button>
         */}
        </div>
      </div>
    </section>
  );
};

export default Reparaciones;

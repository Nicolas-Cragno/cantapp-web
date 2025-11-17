// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";
import { IoKeySharp as LogoKey } from "react-icons/io5";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import TablaVirtual from "../../components/tablas/TablaVirtual";
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
import FichaEventoPorteria from "../../components/fichas/FichaEventoPorteria";
import FichaLlave from "../../components/fichas/FichaLlave";

import FormularioEventoPorteria from "../../components/forms/FormEventoPorteria";
import FormLlave from "../../components/forms/FormLlave";

import ModalVehiculo from "../../components/modales/ModalVehiculo";
import ModalPersona from "../../components/modales/ModalPersona";

import LogoPorteria from "../../assets/logos/logoporteria-w.png";
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoPersona from "../../assets/logos/logopersonal-w.png";
import LogoAuto from "../../assets/logos/logoutilitario-w.png";

const Movimientos = () => {
  const AREA = "porteria";
  const {
    eventos,
    personas,
    empresas,
    tractores,
    furgones,
    vehiculos,
    loading,
  } = useData();
  const [filtro, setFiltro] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);

  const columnasPorteria = [
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
      render: (v) => formatearFecha(v) + " - " + formatearHora(v) + " hs",
      offresponsive: true,
    },
    {
      titulo: "TIPO",
      campo: "tipo",
      render: (v) =>
        v === "ENTREGA" || v === "DEJA" || v === "RETIRA" ? v + " LLAVES" : v,
    },
    {
      titulo: "PERSONA",
      campo: "persona",
      render: (p, fila) => {
        const valor =
          fila.persona !== null
            ? buscarPersona(personas, fila.persona)
            : fila.servicio !== null
            ? buscarEmpresa(empresas, fila.servicio)
            : "";

        if (!valor) return "";

        return valor;
      },
      offresponsive: true,
    },
    {
      titulo: "PERS",
      campo: "persona",
      render: (p, fila) => {
        const valor =
          fila.persona !== null
            ? buscarPersona(personas, fila.persona, false)
            : fila.servicio !== null
            ? buscarEmpresa(empresas, fila.servicio)
            : "";

        if (!valor) return "";

        return valor;
      },
      onresponsive: true,
    },
    {
      titulo: "VEHICULO",
      campo: "tractor",
      render: (t, fila) => {
        const valor = fila.tractor || fila.vehiculo;

        if (!valor) return "";

        if (Array.isArray(valor)) {
          return valor.length ? valor.join(", ") : "";
        }

        return valor;
      },
    },

    {
      titulo: "CARGA / FURGON",
      campo: "furgon",
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

  const cerrarModalPersona = () => {
    setModalPersonaVisible(false);
  };

  const cerrarModalVehiculo = () => {
    setModalVehiculoVisible(false);
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
      } ${tractorDominio} ${furgonDominio} ${e.persona} ${e.servicio} ${e.id}`;
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
          <LogoLoading className="spinner" />
        </div>
      ) : (
        <TablaVirtual
          columnas={columnasPorteria}
          datos={eventosFiltrados}
          onRowClick={(evento) => setEventoSeleccionado(evento)}
        />
      )}

      {eventoSeleccionado &&
        (eventoSeleccionado.tipo === "RETIRA" ||
        eventoSeleccionado.tipo === "ENTREGA" ? (
          <FichaLlave
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
        <FormLlave
          sector="porteria"
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

      {modalVehiculoVisible && (
        <ModalVehiculo
          coleccion={vehiculos}
          tipo={"vehiculos"}
          onClose={cerrarModalVehiculo}
        />
      )}

      <div className="table-options">
        <div className="table-options-group">
          <LogoButton
            logo={LogoAuto}
            onClick={() => setModalVehiculoVisible(true)}
          />
          <LogoButton
            logo={LogoFurgon}
            onClick={() => setModalFurgonVisible(true)}
          />
          <LogoButton
            logo={LogoTractor}
            onClick={() => setModalTractorVisible(true)}
          />
          <LogoButton
            logo={LogoPersona}
            onClick={() => setModalPersonaVisible(true)}
          />
        </div>
        <div className="table-options-group">
          <LogoButton
            logo={<LogoKey />}
            onClick={() => setModalKeyVisible(true)}
          />
          <TextButton
            text="+ AGREGAR"
            onClick={() => setModalAgregarVisible(true)}
          />
        </div>
      </div>
    </section>
  );
};

export default Movimientos;

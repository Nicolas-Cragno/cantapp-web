// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useEffect, useCallback } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import TablaVirtual from "../../components/tablas/TablaVirtual";
import TextButton from "../../components/buttons/TextButton";
import FullButton from "../../components/buttons/FullButton";
import InputBusqueda from "../../components/inputs/InputBusqueda";
import LogoButton from "../../components/buttons/LogoButton";
import FichaEventoPorteria from "../../components/fichas/FichaEventoPorteria";
import FichaEventoSatelital from "../../components/fichas/FichaEventoSatelital";
import FichaLlave from "../../components/fichas/FichaLlave";
import FormGestor from "../../components/forms/FormGestor";
import ModalPersona from "../../components/modales/ModalPersona";
import ModalVehiculo from "../../components/modales/ModalVehiculo";

import LogoSatelital from "../../assets/logos/logosatelital-w.png";
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoPersona from "../../assets/logos/logopersonal-w.png";
import LogoAuto from "../../assets/logos/logoutilitario-w.png";

// ----------------------------------------------------------------------- data
import useEventosSatelital from "../../context/hooks/useEventosSatelital";

const RegistroSatelital = () => {
  const AREA = "satelital";
  const { eventosSatelital, loading } = useEventosSatelital();

  const [filtro, setFiltro] = useState("");
  const [filtroDebounced, setFiltroDebounced] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const { tractores, furgones, vehiculos } = useData();

  // ------------------------------------------------ Debounce eficiente
  useEffect(() => {
    const t = setTimeout(() => setFiltroDebounced(filtro), 150);
    return () => clearTimeout(t);
  }, [filtro]);

  // ------------------------------------------------ Columnas memoizadas
  const columnas = useMemo(
    () => [
      { titulo: "#", campo: "id", offresponsive: true },
      {
        titulo: "FECHA",
        campo: "fecha",
        render: (v, ev) => `${ev.fechaFormateada} - ${ev.horaFormateada} hs`,
        offresponsive: true,
      },
      {
        titulo: "FECHA",
        campo: "fecha",
        render: (v, ev) => ev.fechaReducida,
        onresponsive: true,
      },
      { titulo: "TIPO", campo: "tipo" },
      {
        titulo: "PERSONA",
        campo: "persona",
        render: (p, ev) => ev.nombrePersona,
      },
      {
        titulo: "VEHICULO",
        campo: "movil",
        render: (p, ev) => {
          if (Array.isArray(ev.movil)) {
            return ev.movil.join(", ");
          }
          return ev.movil || "";
        },
      },
      { titulo: "CARGA / FURGON", campo: "furgon", offresponsive: true },
      {
        titulo: "CARGA",
        campo: "usuario",
        render: (u) => u.toUpperCase(),
        offresponsive: true,
      },
    ],
    []
  );

  // ------------------------------------------------ Filtrado rápido usando searchText
  const eventosFiltrados = useMemo(() => {
    if (!filtroDebounced.trim()) return eventosSatelital;
    const f = filtroDebounced.toLowerCase();
    return eventosSatelital.filter((ev) => ev.searchText.includes(f));
  }, [filtroDebounced, eventosSatelital]);

  const cerrar = useCallback(() => setEventoSeleccionado(null), []);

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoSatelital} alt="" className="table-logo" />
          SATELITAL
        </h1>

        <InputBusqueda value={filtro} onChange={setFiltro} />
      </div>

      {loading ? (
        <div className="loading-item">
          <LogoLoading className="spinner" />
        </div>
      ) : (
        <TablaVirtual
          columnas={columnas}
          data={eventosFiltrados}
          onRowClick={setEventoSeleccionado}
        />
      )}

      {eventoSeleccionado && (
        <FichaEventoSatelital
          elemento={eventoSeleccionado}
          onClose={cerrar}
          onGuardar={cerrar}
        />
      )}

      {/* ---------------- MODALES ---------------- */}
      {modalVehiculoVisible && (
        <ModalVehiculo
          coleccion={vehiculos}
          tipo={"vehiculos"}
          onClose={() => setModalVehiculoVisible(false)}
        />
      )}
      {modalTractorVisible && (
        <ModalVehiculo
          coleccion={tractores}
          tipo={"tractores"}
          onClose={() => setModalTractorVisible(false)}
        />
      )}
      {modalFurgonVisible && (
        <ModalVehiculo
          coleccion={furgones}
          tipo={"furgones"}
          onClose={() => setModalFurgonVisible(false)}
        />
      )}
      {modalAgregarVisible && (
        <FormGestor
          tipo={AREA}
          onClose={() => setModalAgregarVisible(false)}
          onGuardar={cerrar}
        />
      )}

      {modalPersonaVisible && (
        <ModalPersona onClose={() => setModalPersonaVisible(false)} />
      )}

      {/* ---------------- OPCIONES ---------------- */}
      <div className="table-options">
        <div className="table-options-group">
          <FullButton
            logo={LogoAuto}
            text="VEHICULOS"
            onClick={() => {
              setModalVehiculoVisible(true);
            }}
          />
          <FullButton
            logo={LogoFurgon}
            text="FURGONES"
            onClick={() => {
              setModalFurgonVisible(true);
            }}
          />
          <FullButton
            logo={LogoTractor}
            text="TRACTORES"
            onClick={() => {
              setModalTractorVisible(true);
            }}
          />
          <FullButton
            logo={LogoPersona}
            text="PERSONAS"
            onClick={() => setModalPersonaVisible(true)}
          />
        </div>

        <div className="table-options-group">
          <TextButton
            text="+ AGREGAR"
            onClick={() => setModalAgregarVisible(true)}
          />
        </div>
      </div>
    </section>
  );
};

export default RegistroSatelital;

// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useCallback } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";
import { IoKeySharp as LogoKey } from "react-icons/io5";

// ----------------------------------------------------------------------- imports internos
import TablaVirtual from "../../components/tablas/TablaVirtual";
import TextButton from "../../components/buttons/TextButton";
import LogoButton from "../../components/buttons/LogoButton";
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

// ----------------------------------------------------------------------- data
import useMovimientos from "../../context/hooks/compounds/useMovimientos";
import useTractores from "../../context/hooks/useTractores";
import useFurgones from "../../context/hooks/useFurgones";
import useVehiculos from "../../context/hooks/useVehiculos";

const Movimientos = () => {
  const AREA = "porteria";

  const { movimientos, loading} = useMovimientos();
  const tractores = useTractores();
  const furgones = useFurgones();
  const vehiculos = useVehiculos();
  const [filtro, setFiltro] = useState("");
  const [filtroDebounced, setFiltroDebounced] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);

  useMemo(() => {
    const t = setTimeout(() => setFiltroDebounced(filtro), 300);
    return () => clearTimeout(t);
  }, [filtro]);

  
  const columnas = useMemo(() => {
        const columnasPorteria = [
          { titulo: "#", campo: "id", offresponsive: true },
          { titulo: "FECHA", campo: "fecha", render: (v, ev) => ev.fechaFormateada + " - " + ev.horaFormateada + " hs", offresponsive: true },
          { titulo: "FECHA", campo: "fecha", render: (v, ev) => ev.fechaReducida, onresponsive: true },
          { titulo: "TIPO", campo: "tipo" },
          { titulo: "PERSONA", campo: "persona", render: (p, ev)=> ev.nombrePersona},          
          { titulo: "VEHICULO", campo: "movil", render: (p, ev) => ev.internoMovil ? ev.internoMovil + " (" + ev.dominioMovil + ")" : ev.dominioMovil },
          { titulo: "CARGA / FURGON", campo: "furgon", offresponsive: true },
          { titulo: "CARGA", campo: "operador", offresponsive: true },
        ];

      return columnasPorteria;
    }, [AREA]);
  
  const cerrarModal = useCallback(() => setEventoSeleccionado(null), []);
  const cerrarModalAgregar = useCallback(() => setModalAgregarVisible(false), []);
  const cerrarModalKey = useCallback(() => setModalKeyVisible(false), []);
  const cerrarModalTractor = useCallback(() => setModalTractorVisible(false), []);
  const cerrarModalFurgon = useCallback(() => setModalFurgonVisible(false), []);
  const cerrarModalPersona = useCallback(() => setModalPersonaVisible(false), []);

  const handleGuardar = () => {
    setModalAgregarVisible(false);
    setEventoSeleccionado(null);
  };

  const movimientosFiltrados = useMemo(() => {
  if (!filtroDebounced.trim()) return movimientos;

  const f = filtroDebounced.toLowerCase();

  return movimientos.filter(ev =>
    JSON.stringify(ev).toLowerCase().includes(f)
  );
}, [filtroDebounced, movimientos]);

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoPorteria} alt="" className="table-logo" />
          PORTERIA
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
          columnas={columnas}
          data={movimientosFiltrados || []}
          onRowClick={(e) => setEventoSeleccionado(e)}
        />
      )}

      {eventoSeleccionado &&
        (eventoSeleccionado.tipo === "RETIRA" ||
        eventoSeleccionado.tipo === "ENTREGA" ? (
          <FichaLlave
            elemento={eventoSeleccionado}
            onClose={() => setEventoSeleccionado(null)}
            onGuardar={handleGuardar}
          />
        ) : (
          <FichaEventoPorteria
            elemento={eventoSeleccionado}
            onClose={() => setEventoSeleccionado(null)}
            onGuardar={handleGuardar}
          />
        ))}

      {modalAgregarVisible && (
        <FormularioEventoPorteria
          onClose={() => setModalAgregarVisible(false)}
          onGuardar={handleGuardar}
        />
      )}

      {modalKeyVisible && (
        <FormLlave
          sector="porteria"
          onClose={() => setModalKeyVisible(false)}
          onGuardar={handleGuardar}
        />
      )}

      {modalTractorVisible && (
        <ModalVehiculo
          coleccion={tractores}
          tipo="tractores"
          onClose={() => setModalTractorVisible(false)}
        />
      )}

      {modalPersonaVisible && (
        <ModalPersona onClose={() => setModalPersonaVisible(false)} />
      )}

      {modalFurgonVisible && (
        <ModalVehiculo
          coleccion={furgones}
          tipo="furgones"
          onClose={() => setModalFurgonVisible(false)}
        />
      )}

      {modalVehiculoVisible && (
        <ModalVehiculo
          coleccion={vehiculos}
          tipo="vehiculos"
          onClose={() => setModalVehiculoVisible(false)}
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
          <LogoButton logo={<LogoKey />} onClick={() => setModalKeyVisible(true)} />
          <TextButton text="+ AGREGAR" onClick={() => setModalAgregarVisible(true)} />
        </div>
      </div>
    </section>
  );
};

export default Movimientos;

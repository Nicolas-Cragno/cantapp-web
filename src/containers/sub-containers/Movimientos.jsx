// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useEffect, useCallback } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";
import { IoKeySharp as LogoKey } from "react-icons/io5";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import TablaVirtual from "../../components/tablas/TablaVirtual";
import TextButton from "../../components/buttons/TextButton";
import FullButton from "../../components/buttons/FullButton";
import InputBusqueda from "../../components/inputs/InputBusqueda";
import LogoButton from "../../components/buttons/LogoButton";
import FichaEventoPorteria from "../../components/fichas/FichaEventoPorteria";
import FichaLlave from "../../components/fichas/FichaLlave";
import FormLlave from "../../components/forms/FormLlave";
import FormGestor from "../../components/forms/FormGestor";
import ModalPersona from "../../components/modales/ModalPersona";
import ModalVehiculo from "../../components/modales/ModalVehiculo";

import LogoPorteria from "../../assets/logos/logoporteria-w.png";
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoPersona from "../../assets/logos/logopersonal-w.png";
import LogoAuto from "../../assets/logos/logoutilitario-w.png";

// ----------------------------------------------------------------------- data
import useMovimientos from "../../context/hooks/useMovimientos";

const Movimientos = () => {
  const AREA = "porteria";
  const { movimientos, loading } = useMovimientos();

  const [filtro, setFiltro] = useState("");
  const [filtroDebounced, setFiltroDebounced] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const{tractores, furgones, vehiculos} = useData();

  // ------------------------------------------------ Debounce eficiente
  useEffect(() => {
    const t = setTimeout(() => setFiltroDebounced(filtro), 150);
    return () => clearTimeout(t);
  }, [filtro]);

  // ------------------------------------------------ Columnas memoizadas
  const columnas = useMemo(() => [
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
  }
    },
    { titulo: "CARGA / FURGON", campo: "furgon", offresponsive: true },
    { titulo: "CARGA", campo: "operador", render: (p, ev) => ev.nombreOperador, offresponsive: true },
  ], []);

  // ------------------------------------------------ Filtrado rápido usando searchText
  const movimientosFiltrados = useMemo(() => {
  if (!filtroDebounced.trim()) return movimientos;
  const f = filtroDebounced.toLowerCase();
  return movimientos.filter((ev) => ev.searchText.includes(f));
}, [filtroDebounced, movimientos]);


  const cerrar = useCallback(() => setEventoSeleccionado(null), []);

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoPorteria} alt="" className="table-logo" />
          PORTERIA
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
          data={movimientosFiltrados}
          onRowClick={setEventoSeleccionado}
        />
      )}

      {eventoSeleccionado && (
        ["RETIRA", "ENTREGA"].includes(eventoSeleccionado.tipo) ? (
          <FichaLlave
            elemento={eventoSeleccionado}
            onClose={cerrar}
            onGuardar={cerrar}
          />
        ) : (
          <FichaEventoPorteria
            elemento={eventoSeleccionado}
            onClose={cerrar}
            onGuardar={cerrar}
          />
        )
      )}

      {/* ---------------- MODALES ---------------- */}
      {modalVehiculoVisible && <ModalVehiculo coleccion={vehiculos} tipo={"vehiculos"} onClose={()=>setModalVehiculoVisible(false)}/>}
       {modalTractorVisible && <ModalVehiculo coleccion={tractores} tipo={"tractores"} onClose={()=>setModalTractorVisible(false)}/>}
        {modalFurgonVisible && <ModalVehiculo coleccion={furgones} tipo={"furgones"} onClose={()=>setModalFurgonVisible(false)}/>}
      {modalAgregarVisible && <FormGestor tipo={AREA} onClose={() => setModalAgregarVisible(false)} onGuardar={cerrar} />}
      {modalKeyVisible && <FormLlave sector={AREA} onClose={() => setModalKeyVisible(false)} onGuardar={cerrar} />}
      {modalPersonaVisible && <ModalPersona onClose={() => setModalPersonaVisible(false)} />}

      {/* ---------------- OPCIONES ---------------- */}
      <div className="table-options">
        <div className="table-options-group">
          <FullButton logo={LogoAuto} text="VEHICULOS" onClick={() => {setModalVehiculoVisible(true)}}/>
          <FullButton logo={LogoFurgon} text="FURGONES" onClick={() => {setModalFurgonVisible(true)}} />
          <FullButton logo={LogoTractor} text="TRACTORES" onClick={() => {setModalTractorVisible(true)}} />
          <FullButton logo={LogoPersona} text="PERSONAS" onClick={() => setModalPersonaVisible(true)} />
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

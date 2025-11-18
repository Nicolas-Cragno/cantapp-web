// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useEffect, useCallback } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";
import { FaKey as LogoKey } from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import TablaVirtual from "../../components/tablas/TablaVirtual";
import FichaGestor from "../../components/fichas/FichaGestor";
import FormGestor from "../../components/forms/FormGestor";
import FormLlave from "../../components/forms/FormLlave";
import ModalStock from "../../components/modales/ModalStock";
import ModalEventos from "../../components/modales/ModalEventos";
import ModalPersona from "../../components/modales/ModalPersona";
import ModalProveedor from "../../components/modales/ModalProveedor";
import ModalVehiculo from "../../components/modales/ModalVehiculo";
import TextButton from "../../components/buttons/TextButton";
import FullButton from "../../components/buttons/FullButton";

import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoDefault from "../../assets/logos/logo.svg";
import LogoStock from "../../assets/logos/logostock-w.png";
import LogoProveedor from "../../assets/logos/logoproveedor-grey.png";
import LogoPersona from "../../assets/logos/logopersonal-w.png";
import "../css/Sections.css";

// ----------------------------------------------------------------------- data
import useReparaciones from "../../context/hooks/useReparaciones";

const Reparaciones = ({ filtroSector = "tractores" }) => {
  const AREA = filtroSector.toLowerCase();

  const { reparaciones, loading } = useReparaciones(filtroSector);
  const {tractores, furgones} = useData();

  const [filtro, setFiltro] = useState("");
  const [filtroDebounced, setFiltroDebounced] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalIngresosVisible, setModalIngresosVisible] = useState(false);
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);

  // ------------------------------------------------ Debounce eficiente
  useEffect(() => {
    const t = setTimeout(() => setFiltroDebounced(filtro), 200);
    return () => clearTimeout(t);
  }, [filtro]);

  // ------------------------------------------------ Columnas memoizadas
  const columnas = useMemo(() => {
    const base = [
      { titulo: "#", campo: "id", offresponsive: true },
      {
        titulo: "FECHA",
        campo: "fecha",
        render: (v, ev) => ev.fechaFormateada + " - " + ev.horaFormateada + " hs",
        offresponsive: true,
      },
      {
        titulo: "FECHA",
        campo: "fecha",
        render: (v, ev) => ev.fechaReducida,
        onresponsive: true,
      },
      { titulo: "TIPO", campo: "tipo" },
      { titulo: "MECÁNICO / PROVEEDOR", campo: "mecanicoTxt" },
    ];

    const fin = [
      { titulo: "DETALLE", campo: "detalle", offresponsive: true },
      { titulo: "SUCURSAL", campo: "sucursal", render: (v, ev) => ev.nombreSucursal },
    ];

    if (AREA === "tractores") {
      return [
        ...base,
        { titulo: "TRACTOR", campo: "tractor", render: (t, ev) => `${t} (${ev.dominioTractor})` },
        { titulo: "KM", campo: "kilometraje", offresponsive: true },
        ...fin,
      ];
    }

    if (AREA === "furgones") {
      return [
        ...base,
        { titulo: "FURGÓN", campo: "furgon", render: (f, ev) => `${f} (${ev.dominioFurgon})` },
        ...fin,
      ];
    }

    return [...base, ...fin];
  }, [AREA]);

  // ------------------------------------------------ Filtrado rápido usando searchText
  const reparacionesFiltradas = useMemo(() => {
    if (!filtroDebounced.trim()) return reparaciones;
    const f = filtroDebounced.toLowerCase();
    return reparaciones?.filter((ev) => ev.searchText?.includes(f));
  }, [filtroDebounced, reparaciones]);

  const cerrar = useCallback(() => setEventoSeleccionado(null), []);

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img
            src={AREA === "tractores" ? LogoTractor : AREA === "furgones" ? LogoFurgon : LogoDefault}
            alt=""
            className="table-logo"
          />
          TALLER {AREA.toUpperCase()}
        </h1>

        <TextButton text="Ver ingresos" onClick={() => setModalIngresosVisible(true)} />

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
        <TablaVirtual columnas={columnas} data={reparacionesFiltradas} onRowClick={setEventoSeleccionado} />
      )}

      {eventoSeleccionado && (
        <FichaGestor
          tipo={["RETIRA", "ENTREGA"].includes(eventoSeleccionado.tipo) ? "llave" : AREA}
          filtroVehiculo={AREA}
          elemento={eventoSeleccionado}
          onClose={cerrar}
          onGuardar={cerrar}
        />
      )}

      {modalAgregarVisible && (
        <FormGestor tipo={AREA} filtroVehiculo={AREA} onClose={() => setModalAgregarVisible(false)} onGuardar={cerrar} />
      )}

      {modalKeyVisible && (
        <FormLlave sector={AREA} onClose={() => setModalKeyVisible(false)} onGuardar={cerrar} />
      )}
      {modalTractorVisible && <ModalVehiculo coleccion={tractores} tipo={AREA} onClose={()=>setModalTractorVisible(false)}/>}
        {modalFurgonVisible && <ModalVehiculo coleccion={furgones} tipo={AREA} onClose={()=>setModalFurgonVisible(false)}/>}
      {modalStockVisible && <ModalStock taller={AREA} onClose={() => setModalStockVisible(false)} />}
      {modalProveedorVisible && <ModalProveedor onClose={() => setModalProveedorVisible(false)} />}
      {modalPersonaVisible && <ModalPersona puesto="mecanico" onClose={() => setModalPersonaVisible(false)} />}
      {modalIngresosVisible && <ModalEventos tipo="STOCK" filtroSector={AREA} onClose={() => setModalIngresosVisible(false)} />}

      {/* ---------------- OPCIONES ---------------- */}
      <div className="table-options">
        <div className="table-options-group">
          {AREA === "tractores" && (<FullButton logo={LogoTractor} text="TRACTORES" onClick={() => {setModalTractorVisible(true)}}/>)}
          {AREA === "furgones" && ( <FullButton logo={LogoFurgon} text="FURGONES" onClick={() => {setModalFurgonVisible(true)}} />)}
          <FullButton logo={LogoStock} text="REPUESTOS" onClick={() => {setModalStockVisible(true)}} />
          <FullButton logo={LogoPersona} text="MECANICOS" onClick={() => setModalPersonaVisible(true)} />
        </div>
        <div className="table-options-group">
          {AREA === "tractores" && (
            <button className="table-agregar" onClick={() => setModalKeyVisible(true)}>
              <LogoKey className="button-logo" />
            </button>
          )}
          <TextButton text="+ AGREGAR" onClick={() => setModalAgregarVisible(true)} />
        </div>
      </div>
    </section>
  );
};

export default Reparaciones;

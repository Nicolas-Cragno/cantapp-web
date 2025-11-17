// Reparaciones.jsx
import { useState, useMemo, useCallback } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";
import { IoKeySharp as LogoKey } from "react-icons/io5";

import useReparaciones from "../../context/hooks/compounds/useReparaciones";
import useTractores from "../../context/hooks/useTractores";
import useFurgones from "../../context/hooks/useFurgones";

import TablaVirtual from "../../components/tablas/TablaVirtual";
import FichaGestor from "../../components/fichas/FichaGestor";
import FormGestor from "../../components/forms/FormGestor";
import FormLlave from "../../components/forms/FormLlave";
import ModalVehiculo from "../../components/modales/ModalVehiculo";
import ModalStock from "../../components/modales/ModalStock";
import ModalEventos from "../../components/modales/ModalEventos";
import ModalPersona from "../../components/modales/ModalPersona";
import ModalProveedor from "../../components/modales/ModalProveedor";
import TextButton from "../../components/buttons/TextButton";

import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoDefault from "../../assets/logos/logo.svg";
import LogoStock from "../../assets/logos/logostock-w.png";
import LogoProveedor from "../../assets/logos/logoproveedor-grey.png";
import LogoPersona from "../../assets/logos/logopersonal-b.png";

const Reparaciones = ({ filtroSector = "tractores" }) => {
  const AREA = filtroSector;

  const { reparaciones: eventos, loading } = useReparaciones();
  const { tractores } = useTractores();
  const { furgones } = useFurgones();

  const [filtro, setFiltro] = useState("");
  const [filtroDebounced, setFiltroDebounced] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalIngresosVisible, setModalIngresosVisible] = useState(false);
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);

  // ------------------ Debounce del filtro
  useMemo(() => {
    const t = setTimeout(() => setFiltroDebounced(filtro), 300);
    return () => clearTimeout(t);
  }, [filtro]);

  // ------------------ Columnas básicas
  const columnas = useMemo(() => {
    const columnasBase = [
      { titulo: "#", campo: "id", offresponsive: true },
      { titulo: "FECHA", campo: "fecha", render: (v) => v.fechaFormateada + " - " + v.horaFormateada, offresponsive: true },
      { titulo: "TIPO", campo: "tipo" },
      { titulo: "MECÁNICO / PROVEEDOR", campo: "mecanicoTxt" },
    ];

    if (AREA === "tractores") {
      return [
        ...columnasBase,
        { titulo: "TRACTOR", campo: "dominioTractor" },
        { titulo: "DETALLE", campo: "detalle", offresponsive: true },
      ];
    } else if (AREA === "furgones") {
      return [
        ...columnasBase,
        { titulo: "FURGON", campo: "dominioFurgon" },
        { titulo: "DETALLE", campo: "detalle", offresponsive: true },
      ];
    }

    return columnasBase;
  }, [AREA]);

  // ------------------ Filtrado de eventos por searchText
  const eventosFiltrados = useMemo(() => {
    if (!Array.isArray(eventos) || eventos.length === 0) return [];
    let filtrados = eventos.filter(e => e.area === AREA && e.tipo !== "STOCK");

    const filtros = (filtroDebounced || "")
      .split(",")
      .map(f => f.trim().toLowerCase())
      .filter(f => f.length > 0);

    if (filtros.length === 0) return filtrados;

    return filtrados.filter(e => filtros.every(term => e.searchText.includes(term)));
  }, [eventos, filtroDebounced, AREA]);

  // ------------------ Handlers modales
  const cerrarModal = useCallback(() => setEventoSeleccionado(null), []);
  const cerrarModalAgregar = useCallback(() => setModalAgregarVisible(false), []);
  const cerrarModalKey = useCallback(() => setModalKeyVisible(false), []);
  const cerrarModalTractor = useCallback(() => setModalTractorVisible(false), []);
  const cerrarModalFurgon = useCallback(() => setModalFurgonVisible(false), []);
  const cerrarModalStock = useCallback(() => setModalStockVisible(false), []);
  const cerrarModalIngresos = useCallback(() => setModalIngresosVisible(false), []);
  const cerrarModalProveedor = useCallback(() => setModalProveedorVisible(false), []);
  const cerrarModalPersona = useCallback(() => setModalPersonaVisible(false), []);

  const handleGuardar = useCallback(() => {
    setModalAgregarVisible(false);
    setEventoSeleccionado(null);
  }, []);

  // ------------------ Render
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

        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="table-busqueda"
        />
      </div>

      {loading ? (
        <div className="loading-item"><LogoLoading className="spinner" /></div>
      ) : (
        <TablaVirtual columnas={columnas} datos={eventosFiltrados} onRowClick={setEventoSeleccionado} />
      )}

      {eventoSeleccionado && (
        <FichaGestor
          tipo={["RETIRA","ENTREGA"].includes(eventoSeleccionado.tipo) ? "llave" : AREA}
          filtroVehiculo={AREA}
          elemento={eventoSeleccionado}
          onClose={cerrarModal}
          onGuardar={handleGuardar}
        />
      )}

      {modalAgregarVisible && <FormGestor tipo={AREA} filtroVehiculo={AREA} onClose={cerrarModalAgregar} onGuardar={handleGuardar} />}
      {modalKeyVisible && <FormLlave sector="tractores" onClose={cerrarModalKey} onGuardar={handleGuardar} />}
      {modalTractorVisible && <ModalVehiculo coleccion={tractores} tipo="tractores" onClose={cerrarModalTractor} />}
      {modalFurgonVisible && <ModalVehiculo coleccion={furgones} tipo="furgones" onClose={cerrarModalFurgon} />}
      {modalStockVisible && <ModalStock taller={AREA} onClose={cerrarModalStock} />}
      {modalProveedorVisible && <ModalProveedor onClose={cerrarModalProveedor} />}
      {modalIngresosVisible && <ModalEventos tipo="STOCK" filtroSector={AREA} onClose={cerrarModalIngresos} />}
      {modalPersonaVisible && <ModalPersona puesto="mecanico" onClose={cerrarModalPersona} />}
    </section>
  );
};

export default Reparaciones;

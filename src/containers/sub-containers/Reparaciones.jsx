// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useCallback } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";
import { FaKey as LogoKey} from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
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
import LogoPersona from "../../assets/logos/logopersonal-w.png";
import "../css/Sections.css";


// ----------------------------------------------------------------------- data
import { useData } from "../../context/DataContext";
import useReparaciones from "../../context/hooks/compounds/useReparaciones";
import useTractores from "../../context/hooks/useTractores";
import useFurgones from "../../context/hooks/useFurgones";
import { formatearFecha, formatearFechaCorta, formatearHora } from "../../functions/dataFunctions";

const Reparaciones = ({ filtroSector = "tractores" }) => {
  const AREA = filtroSector.toLocaleLowerCase();

  const {reparaciones, loading } = useReparaciones(filtroSector);

  //const { reparaciones: eventos, loading } = useReparaciones(filtroSector);
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

    useMemo(() => {
      const t = setTimeout(() => setFiltroDebounced(filtro), 300);
      return () => clearTimeout(t);
    }, [filtro]);

    const columnas = useMemo(() => {
    let columnasTotal;
    const columnasInicio = [
      { titulo: "#", campo: "id", offresponsive: true },
      { titulo: "FECHA", campo: "fecha", render: (v, ev) => ev.fechaFormateada + " - " + ev.horaFormateada + " hs", offresponsive: true },
      { titulo: "FECHA", campo: "fecha", render: (v, ev) => ev.fechaReducida, onresponsive: true },
      { titulo: "TIPO", campo: "tipo"},
      { titulo: "MECÁNICO / PROVEEDOR", campo: "mecanicoTxt"},

    ];
    const columnasFinal = [
      { titulo: "DETALLE", campo: "detalle", offresponsive: true },
      { titulo: "SUCURSAL", campo: "sucursal", render: (s, ev) => ev.nombreSucursal},

    ]
    const columnasTractores = [
      ...columnasInicio,
      { titulo: "TRACTOR", campo: "tractor", render: (t, ev) => t + " (" + ev.dominioTractor + ")"},
      { titulo: "KM", campo: "kilometraje", offresponsive: true},

      ...columnasFinal,

    ];
      const columnasFurgones = [
        ...columnasInicio,
        { titulo: "FURGON", campo: "furgon", render: (f, ev) => f + " (" + ev.dominioFurgon + ") "},
        /// responsive
        ...columnasFinal,
      ];
    
    switch(AREA)
    {
      case "tractores": columnasTotal=columnasTractores;break;
      case "furgones": columnasTotal=columnasFurgones;break;
      default: columnasTotal=columnasInicio + columnasFinal;break;
    }

    return columnasTotal;
  }, [AREA]);

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

  const reparacionesFiltradas = useMemo(() => {
  if (!filtroDebounced.trim()) return reparaciones;

  const f = filtroDebounced.toLowerCase();

  return reparaciones.filter(ev =>
    JSON.stringify(ev).toLowerCase().includes(f)
  );
}, [filtroDebounced, reparaciones]);

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

        <TextButton text="Ver ingresos" onClick={()=>setModalIngresosVisible(true)}/>

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
        <TablaVirtual columnas={columnas} data={reparacionesFiltradas || []} onRowClick={setEventoSeleccionado} />
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

      <div className="table-options">
        <div className="table-options-group">
          {filtroSector === "tractores" && (<button className="table-agregar" onClick={()=>setModalTractorVisible(true)}>
            <img src={LogoTractor} alt="" className="table-logo2"/>
            <span className="table-logo-span">Tractores</span>
          </button>)}
          {filtroSector === "furgones" && (<button className="table-agregar" onClick={()=>setModalFurgonVisible(true)}>
            <img src={LogoFurgon} alt="" className="table-logo2"/>
            <span className="table-logo-span">Furgones</span>
          </button>)}
          <button className="table-agregar" onClick={()=>setModalStockVisible(true)}>
            <img src={LogoStock} alt="" className="table-logo2"/>
            <span className="table-logo-span">Repuestos</span>
          </button>
          <button
            className="table-agregar"
            onClick={() => setModalProveedorVisible(true)}
          >
            <img src={LogoProveedor} alt="" className="table-logo2" />
            <span className="table-logo-span">Proveedores</span>
          </button>
          <button className="table-agregar" onClick={()=>setModalPersonaVisible(true)}>
            <img src={LogoPersona} alt="" className="table-logo2"/>
            <span className="table-logo-span">Mecanicos</span>
          </button>
        </div>
        <div className="table-options-group">
          {filtroSector === "tractores" && (<button
            className="table-agregar"
            onClick={() => setModalKeyVisible(true)}
          >
            <LogoKey className="button-logo" />
          </button>)}

          <TextButton
            text="+ AGREGAR"
            onClick={() => setModalAgregarVisible(true)}
          />
        </div>
        </div>
    </section>
  );
};

export default Reparaciones;

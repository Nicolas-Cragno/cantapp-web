// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TablaColeccion from "../tablas/TablaColeccion";
import FichaVehiculo from "../fichas/FichaVehiculo";
import {
  buscarNombre,
  buscarPersona,
  formatearFecha,
} from "../../functions/dataFunctions";
import "./css/Modales.css";

const ModalPendientes = ({
  filtroSector = null,
  onRowClick = null,
  onClose,
}) => {
  const [filtro, setFiltro] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const { tractores, furgones, vehiculos, personas } = useData();

  const columnas = [
    {
      titulo: "INTERNO",
      campo: "id",
    },
    {
      titulo: "DOMINIO",
      campo: "dominio",
    },
    {
      titulo: "CHOFER",
      campo: "persona",
      render: (p) => buscarPersona(personas, p),
    },
    {
      titulo: "PENDIENTES",
      campo: "pendientes",
      render: (p, ev) => {
        if (!Array.isArray(ev.pendientes)) return "";

        return (
          <div>
            {ev.pendientes.map((pend, i) => (
              <>
                <span className="datebox">{formatearFecha(pend.fecha)}</span>
                {"     "}
                <span>{pend.detalle}</span>
              </>
            ))}
          </div>
        );
      },
    },
  ];

  let vehiculosFinal;

  switch (filtroSector) {
    case "tractores":
      vehiculosFinal = tractores.filter(
        (v) => v.pendientes && v.pendientes.length > 0
      );
      break;
    case "furgones":
      vehiculosFinal = furgones.filter(
        (v) => v.pendientes && v.pendientes.length > 0
      );
      break;
    default:
      vehiculosFinal = vehiculos.filter(
        (v) => v.pendientes && v.pendientes.length > 0
      );
      break;
  }

  const vehiculosFiltrados = useMemo(() => {
    const filtroPendiente = vehiculosFinal.filter(
      (v) => v.pendientes && v.pendientes.length > 0
    );

    return filtroPendiente.filter((e) => {
      const textoFiltro = `${e.id} ${e.interno} ${e.dominio} ${e.pendientes}`;
      return textoFiltro.toLocaleLowerCase().includes(filtro.toLowerCase());
    });
  });
  const cerrarModalFicha = () => {
    setModalFichaVisible(false);
  };
  const handleGuardar = async () => {
    setModalFichaVisible(false);
    setVehiculoSeleccionado(null);
  };

  return (
    <div className="modal">
      <div className="modal-content-2">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h1 className="modal-title">
            <strong>{`LISTADO PENDIENTES${
              filtroSector ? " DE " + filtroSector.toUpperCase() : ""
            }`}</strong>{" "}
          </h1>
          <div className="modal-input-filtro">
            <label className="modal-label">FILTRO </label>
            <input
              type="text"
              placeholder="..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>
        <TablaColeccion
          columnas={columnas}
          datos={vehiculosFiltrados}
          onRowClick={(vehiculo) => {
            setVehiculoSeleccionado(vehiculo);
            setModalFichaVisible(true);
          }}
        />

        {modalFichaVisible && (
          <FichaVehiculo
            elemento={vehiculoSeleccionado}
            tipoVehiculo={filtroSector}
            onClose={cerrarModalFicha}
            onGuardar={handleGuardar}
          />
        )}
      </div>
    </div>
  );
};

export default ModalPendientes;

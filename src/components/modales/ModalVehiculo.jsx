// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import { FaTruck, FaPlus, FaCarAlt } from "react-icons/fa";

import { PiShippingContainerDuotone } from "react-icons/pi";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TablaColeccion from "../tablas/TablaColeccion";
import {
  buscarPersona,
  formatearFecha,
  formatearHora,
} from "../../functions/dataFunctions";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";
import LogoEmpresa from "../logos/LogoEmpresa";
import FichaGestor from "../fichas/FichaGestor";
import FormVehiculo from "../forms/FormVehiculo";
// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Modales.css";

const ModalVehiculo = ({
  coleccion = [],
  tipo = "tractores",
  propios = false,
  onClose,
}) => {
  const [filtro, setFiltro] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const { personas } = useData();

  const columnaParticular = [
    {
      titulo: "DOMINIO",
      campo: "dominio",
    },
    {
      titulo: "MARCA",
      campo: "marca",
    },
    {
      titulo: "USUARIO",
      campo: "persona",
      render: (e) => buscarPersona(personas, e, false),
      offresponsive: true,
    },
  ];

  const columnaParticularPropios = [
    {
      titulo: "DOMINIO",
      campo: "dominio",
    },
    {
      titulo: "MARCA",
      campo: "marca",
    },
    {
      titulo: "EMPRESA",
      campo: "empresa",
      render: (e) => <LogoEmpresaTxt cuitEmpresa={e} completo={false} />,
    },
  ];

  const columnasVehiculo = [
    {
      titulo: "INT",
      campo: "interno",
    },
    {
      titulo: "DOMINIO",
      campo: "dominio",
    },
    {
      titulo: "EMPRESA",
      campo: "empresa",
      render: (e) => <LogoEmpresaTxt cuitEmpresa={e} completo={false} />,
    },
  ];

  const cerrarModalFicha = () => {
    setModalFichaVisible(false);
  };

  // Filtrado + ordenado
  const vehiculosFiltrados = useMemo(() => {
    let ordenados = [...coleccion].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    let listadoFinal;

    if (propios) {
      listadoFinal = ordenados.filter(
        (v) => v.estado === true || v.estado === 1 || v.estado === "1"
      );
    } else {
      listadoFinal = ordenados;
    }

    return listadoFinal.filter((e) => {
      const fechaTxt = formatearFecha(e.fecha);
      const horaTxt = formatearHora(e.fecha);
      const usuario = buscarPersona(personas, e.persona);
      const textoFiltro = `${fechaTxt} ${horaTxt} ${e.tipo} ${e.dominio} ${e.interno} ${e.marca} ${e.persona} ${usuario}`;
      return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
    });
  }, [coleccion, filtro]);

  const handleGuardar = async () => {
    setModalFichaVisible(false);
    setVehiculoSeleccionado(false);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h1 className="modal-title">
            <strong>{tipo.toUpperCase()}</strong>
          </h1>
          <hr />
          <input
            type="text"
            placeholder="Filtrar vehículos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="modal-input-filtro"
          />
        </div>

        <TablaColeccion
          columnas={
            tipo === "vehiculos" && !propios
              ? columnaParticular
              : tipo === "vehiculos" && propios
              ? columnaParticularPropios
              : columnasVehiculo
          }
          datos={vehiculosFiltrados}
          onRowClick={(vehiculo) => {
            setVehiculoSeleccionado(vehiculo);
            setModalFichaVisible(true);
          }}
        />
        <div className="ficha-buttons">
          <button onClick={() => setModalAgregarVisible(true)}>
            {tipo === "tractores" ? (
              <FaTruck size={26} />
            ) : tipo === "furgones" ? (
              <PiShippingContainerDuotone size={26} />
            ) : (
              <FaCarAlt size={26} />
            )}
            <FaPlus size={16} style={{ marginLeft: "7px" }} />
          </button>
        </div>
        {modalFichaVisible && (
          <FichaGestor
            tipo="vehiculo"
            filtroVehiculo={tipo}
            elemento={vehiculoSeleccionado}
            tipoVehiculo={tipo}
            onClose={cerrarModalFicha}
            onGuardar={handleGuardar}
          />
        )}
        {modalAgregarVisible && (
          <FormVehiculo tipoVehiculo={tipo} onClose={cerrarModalAgregar} />
        )}
      </div>
    </div>
  );
};

export default ModalVehiculo;

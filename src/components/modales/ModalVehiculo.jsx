// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";

// ----------------------------------------------------------------------- internos
import TablaColeccion from "../tablas/TablaColeccion";
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";
import FichaVehiculo from "../fichas/FichaVehiculo";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Modales.css";

const ModalVehiculo = ({ coleccion = [], tipo = "tractores", onClose }) => {
  const [filtro, setFiltro] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);

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

    return ordenados.filter((e) => {
      const fechaTxt = formatearFecha(e.fecha);
      const horaTxt = formatearHora(e.fecha);
      const textoFiltro = `${fechaTxt} ${horaTxt} ${e.tipo} ${e.dominio} ${e.interno}`;
      return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
    });
  }, [coleccion, filtro]);

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
          columnas={columnasVehiculo}
          datos={vehiculosFiltrados}
          onRowClick={(vehiculo) => {
            setVehiculoSeleccionado(vehiculo);
            setModalFichaVisible(true);
          }}
        />

        {modalFichaVisible && (
          <FichaVehiculo
            vehiculo={vehiculoSeleccionado}
            tipoVehiculo={tipo}
            onClose={cerrarModalFicha}
          />
        )}
      </div>
    </div>
  );
};

export default ModalVehiculo;

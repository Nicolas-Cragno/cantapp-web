// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useEffect } from "react";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  abreviarUnidad,
  buscarRepuestoPorID,
} from "../../functions/dataFunctions";
import TablaColeccion from "../tablas/TablaColeccion";
import TextButton from "../buttons/TextButton";
import FichaStock from "../fichas/FichaStock";
import FichaProveedor from "../fichas/FichaProveedor";
import FormStock from "../forms/FormStock";
import FormMovimientoStock from "../forms/FormMovimientoStock";
import "./css/Modales.css";
import FormProveedor from "../forms/FormProveedor";

const ModalProveedor = ({ onClose }) => {
  const [filtro, setFiltro] = useState("");
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const { proveedores } = useData();

  const columnas = [
    {
      titulo: "COD.",
      campo: "id",
    },
    {
      titulo: "CUIT",
      campo: "cuit",
    },
    {
      titulo: "NOMBRE",
      campo: "marca",
    },
  ];

  const cerrarModalFicha = () => {
    setModalFichaVisible(false);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  const proveedoresFiltrados = useMemo(() => {
    const sinGenerico = proveedores.filter((e) => e.id !== "01");
    let ordenados = [...sinGenerico].sort((a, b) => a.id.localeCompare(b.id));

    return ordenados.filter((e) => {
      const textoFiltro = `${e.id} ${e.cuit} ${e.detalle} ${e.marca} ${e.nombre}`;
      return textoFiltro.toLocaleLowerCase().includes(filtro.toLowerCase());
    });
  }, [proveedores, filtro]);

  const handleGuardar = async () => {
    setModalFichaVisible(false);
    setProveedorSeleccionado(null);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h1 className="modal-title">
            <strong>PROVEEDORES</strong>
          </h1>
          <hr />
          <input
            type="text"
            placeholder="Filtrar repuestos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="modal-input-filtro"
          />
        </div>
        <TablaColeccion
          columnas={columnas}
          datos={proveedoresFiltrados}
          onRowClick={(prov) => {
            setProveedorSeleccionado(prov);
            setModalFichaVisible(true);
          }}
        />
        <div className="ficha-buttons">
          <TextButton
            text="+ AGREGAR"
            onClick={() => setModalAgregarVisible(true)}
          />
        </div>
        {modalFichaVisible && (
          <FichaProveedor
            elemento={proveedorSeleccionado}
            onClose={cerrarModalFicha}
            onGuardar={handleGuardar}
          />
        )}
        {modalAgregarVisible && (
          <FormProveedor
            onClose={cerrarModalAgregar}
            onGuardar={handleGuardar}
          />
        )}
      </div>
    </div>
  );
};

export default ModalProveedor;

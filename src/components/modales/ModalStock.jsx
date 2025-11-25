// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useEffect } from "react";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  abreviarUnidad,
  buscarRepuestoPorID,
  buscarNombre,
} from "../../functions/dataFunctions";
import TablaColeccion from "../tablas/TablaColeccion";
import TextButton from "../buttons/TextButton";
import FichaStock from "../fichas/FichaStock";
import FormStock from "../forms/FormStock";
import FormMovimientoStock from "../forms/FormMovimientoStock";
import "./css/Modales.css";

const ModalStock = ({ sucursal = "01", taller = "tractores", onClose }) => {
  const idDepo = taller;
  const [filtro, setFiltro] = useState("");
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);
  const { stock, depositos, proveedores } = useData();

  const columnas = [
    {
      titulo: "COD.",
      campo: "id",
    },
    {
      titulo: "DESCRIPCION",
      campo: "descripcion",
    },
    {
      titulo: "PROVEEDOR",
      campo: "proveedor",
      render: (p) => buscarNombre(proveedores, p),
    },
    {
      titulo: "CODIGO PROV.",
      campo: "codigoProveedor",
    },
    {
      titulo: "STOCK",
      campo: "cantidad",
    },
    {
      titulo: "",
      campo: "unidad",
      render: (u) => abreviarUnidad(u),
    },
  ];

  const cerrarModalFicha = () => {
    setModalFichaVisible(false);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };
  const cerrarModalMovimiento = () => {
    setModalMovimientoVisible(false);
  };
  const articulosFiltrados = useMemo(() => {
    return [...stock]
      .sort((a, b) => a.descripcion.localeCompare(b.descripcion))
      .filter((e) => {
        const proveedor = buscarNombre(proveedores, e.proveedor);
        const textoFiltro = `${e.codigo} ${e.id} ${e.descripcion} ${e.unidad} ${proveedor} ${e.codigoProveedor}`;
        return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
      });
  }, [stock, filtro]);

  const handleGuardar = async (e) => {
    setModalFichaVisible(false);
    setArticuloSeleccionado(null);
  };

  return (
    <div className="modal">
      <div className="modal-content-2">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h1 className="modal-title">
            <strong>REPUESTOS</strong>
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
          datos={articulosFiltrados}
          onRowClick={(art) => {
            setArticuloSeleccionado(art);
            setModalFichaVisible(true);
          }}
        />
        <div className="ficha-buttons">
          <TextButton
            text="+ MOVIMIENTO"
            onClick={() => setModalMovimientoVisible(true)}
          />
          <TextButton
            text="+ AGREGAR"
            onClick={() => setModalAgregarVisible(true)}
          />
        </div>
        {modalFichaVisible && (
          <FichaStock
            articulo={articuloSeleccionado}
            onClose={cerrarModalFicha}
            onGuardar={handleGuardar}
          />
        )}
        {modalAgregarVisible && (
          <FormStock onClose={cerrarModalAgregar} onGuardar={handleGuardar} />
        )}
        {modalMovimientoVisible && (
          <FormMovimientoStock
            taller={taller}
            onClose={cerrarModalMovimiento}
            onGuardar={handleGuardar}
          />
        )}
      </div>
    </div>
  );
};

export default ModalStock;

// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useEffect } from "react";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import {
  abreviarUnidad,
  buscarPersona,
  buscarRepuestoPorID,
} from "../../functions/dataFunctions";
import TablaColeccion from "../tablas/TablaColeccion";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";
import FichaPersonal from "../fichas/FichaPersonal";
import FormPersona from "../forms/FormPersona";
import TextButton from "../buttons/TextButton";
import FichaStock from "../fichas/FichaStock";
import FormStock from "../forms/FormStock";
import FormMovimientoStock from "../forms/FormMovimientoStock";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Modales.css";
import { BsPersonDash } from "react-icons/bs"; // logo innactiva
import { BsPersonCheck } from "react-icons/bs"; // logo activa
import { BsPersonPlusFill } from "react-icons/bs"; // logo agregar

const ModalStock = ({ sucursal = "01", taller = "tractores", onClose }) => {
  const idDepo = taller;
  const [filtro, setFiltro] = useState("");
  const [articulos, setArticulos] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);
  const { stock, depositos } = useData();

  useEffect(() => {
    const depo = depositos.find((d) => d.id === idDepo);
    const stockDepo = depo?.stock || [];
    setArticulos(stockDepo);
  }, []);

  const columnas = [
    {
      titulo: "COD.",
      campo: "id",
    },
    {
      titulo: "DESCRIPCION",
      campo: "id",
      render: (a) => buscarRepuestoPorID(stock, a),
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
    let ordenados = [...articulos].sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion)
    );

    return ordenados.filter((e) => {
      const textoFiltro = `${e.codigo} ${e.id} ${e.descripcion} ${e.unidad}`;
      return textoFiltro.toLocaleLowerCase().includes(filtro.toLowerCase());
    });
  });

  const handleGuardar = async () => {
    setModalFichaVisible(false);
    setArticuloSeleccionado(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h1 className="modal-title">
            <strong>{taller.toUpperCase()}</strong>
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

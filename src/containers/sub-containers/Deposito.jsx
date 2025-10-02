// ----------------------------------------------------------------------- imports externos
import { useState, useEffect, use } from "react";
import { FaSpinner } from "react-icons/fa";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TablaColeccion from "../../components/tablas/TablaColeccion";
import FichaStock from "../../components/fichas/FichaStock";
import FormularioStock from "../../components/forms/FormularioStock";
import FormularioMovimientoStock from "../../components/forms/FormularioMovimientoStock";
import unidades from "../../functions/data/unidades.json";

// ----------------------------------------------------------------------- elementos

// ----------------------------------------------------------------------- visuales, logos, etc

import LogoStock from "../../assets/logos/logostock-w.png";

// --asf asfas

const Deposito = ({ taller = null }) => {
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [articulos, setArticulos] = useState([]);
  const [articulosSeleccionado, setArticuloSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);

  const { stock } = useData();

  // sincronizar stock con estado local
  useEffect(() => {
    if (stock) {
      setArticulos(stock);
      setLoading(false);
    }
  }, [stock]);

  const columnas = [
    { titulo: "ID", campo: "id", offresponsive: true },
    { titulo: "DESCRIPCION", campo: "descripcion" },
    { titulo: "MARCA", campo: "marca" },
    { titulo: "COD. PROVEEDOR", campo: "codigoProveedor", offresponsive: true },
    {
      titulo: "CANTIDAD",
      campo: "cantidad",
      render: (valor, item) => {
        const abreviatura = unidades[item.unidad] || item.unidad || "";
        return `${valor} ${abreviatura}`;
      },
    },
  ];

  // Filtrado principal
  let articulosFiltrados = articulos;

  if (taller) {
    articulosFiltrados = articulosFiltrados.filter(
      (a) => a.deposito?.toLowerCase() === taller.toLowerCase()
    );
  }

  articulosFiltrados = articulosFiltrados
    .filter((a) => {
      const nombreCompleto = `${a.id || ""} ${a.codigoProveedor || ""} ${
        a.descripcion || ""
      } ${a.marca || ""} ${a.cantidad || ""} ${a.unidad || ""}`;
      return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
    })
    .sort((a, b) => {
      const aA = (a.id || "").toLowerCase();
      const aB = (b.id || "").toLowerCase();
      return aA.localeCompare(aB);
    });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoStock} alt="" className="table-logo" />
          REGISTRO DE STOCK
        </h1>
        <input
          type="text"
          placeholder="Buscar ..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="table-busqueda"
        />
      </div>

      {loading ? (
        <div className="loading-item">
          <FaSpinner className="spinner" />
        </div>
      ) : (
        <TablaColeccion
          columnas={columnas}
          datos={articulosFiltrados}
          onRowClick={(art) => setArticuloSeleccionado(art)}
        />
      )}

      {articulosSeleccionado && (
        <FichaStock
          articulo={articulosSeleccionado}
          onClose={() => setArticuloSeleccionado(null)}
          onGuardar={() => {
            setModalAgregarVisible(false);
            setModalMovimientoVisible(false);
            setArticuloSeleccionado(null);
          }}
        />
      )}

      {modalAgregarVisible && (
        <FormularioStock
          onClose={() => setModalAgregarVisible(false)}
          onGuardar={() => setModalAgregarVisible(false)}
        />
      )}

      {modalMovimientoVisible && (
        <FormularioMovimientoStock
          onClose={() => setModalMovimientoVisible(false)}
          onGuardar={() => setModalMovimientoVisible(false)}
        />
      )}

      <div className="table-options">
        <button
          className="table-agregar"
          onClick={() => setModalMovimientoVisible(true)}
        >
          ↓↑ MOVIMIENTO
        </button>
        <button
          className="table-agregar"
          onClick={() => setModalAgregarVisible(true)}
        >
          + AGREGAR
        </button>
      </div>
    </section>
  );
};

export default Deposito;

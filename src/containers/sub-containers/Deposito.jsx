// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import { FaSpinner as LogoLoading, FaTools as LogoTool } from "react-icons/fa";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TablaVirtual from "../../components/tablas/TablaVirtual";
import FichaStock from "../../components/fichas/FichaStock";
import FormStock from "../../components/forms/FormStock";
import FormHerramienta from "../../components/forms/FormHerramienta";
import FormMovimientoStock from "../../components/forms/FormMovimientoStock";
import ModalEventos from "../../components/modales/ModalEventos";
import ModalProveedor from "../../components/modales/ModalProveedor";
import unidades from "../../functions/data/unidades.json";
import { buscarNombre } from "../../functions/dataFunctions";
import LogoStock from "../../assets/logos/logostock-w.png";
import LogoProveedor from "../../assets/logos/logoproveedor-grey.png";
import TextButton from "../../components/buttons/TextButton";
import TablaColeccion from "../../components/tablas/TablaColeccion";

const Deposito = ({ taller = null }) => {
  const [filtro, setFiltro] = useState("");
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);
  const [modalEventosVisible, setModalEventosVisible] = useState(false);
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);
  const [modalHerramientasVisible, setModalHerramientasVisible] = useState(false);

const { stock = [], proveedores = [] } = useData();
  const loading = !stock || stock.length === 0;

  // ------------------ Columnas de la tabla
  const columnas = [
    { titulo: "ID", campo: "id", offresponsive: true },
    { titulo: "DESCRIPCIÓN", campo: "descripcion" },
    { titulo: "MARCA", campo: "marca" },
    { titulo: "PROVEEDOR", campo: "proveedor", render: (p) => buscarNombre(proveedores, p) },
    { titulo: "COD. PROVEEDOR", campo: "codigoProveedor", offresponsive: true },
    {
      titulo: "CANTIDAD",
      campo: "cantidad",
      render: (valor, item) => {
        const unidad = unidades[item.unidad] || item.unidad || "";
        return `${valor} ${unidad}`;
      },
    },
  ];

  // ------------------ Filtrado y ordenado
  const articulosFiltrados = useMemo(() => {
    return stock
      .filter(a => {
        const texto = `${a.id || ""} ${a.codigoProveedor || ""} ${a.descripcion || ""} ${a.marca || ""} ${a.cantidad || ""} ${a.unidad || ""}`;
        return texto.toLowerCase().includes(filtro.toLowerCase());
      })
      .sort((a, b) => (a.id || "").localeCompare(b.id || ""));
  }, [stock, filtro, taller]);

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoStock} alt="" className="table-logo" />
          REGISTRO DE STOCK 
        </h1>
        <TextButton text="Ver movimientos" onClick={() => setModalEventosVisible(true)} />
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
          <LogoLoading className="spinner" />
        </div>
      ) : (
        <TablaColeccion
          columnas={columnas}
          datos={articulosFiltrados}
          onRowClick={(art) => setArticuloSeleccionado(art)}
        />
      )}

      {articuloSeleccionado && (
        <FichaStock
          articulo={articuloSeleccionado}
          onClose={() => setArticuloSeleccionado(null)}
          onGuardar={() => setArticuloSeleccionado(null)}
        />
      )}

      {modalAgregarVisible && <FormStock onClose={() => setModalAgregarVisible(false)} onGuardar={() => setModalAgregarVisible(false)} />}
      {modalMovimientoVisible && <FormMovimientoStock onClose={() => setModalMovimientoVisible(false)} onGuardar={() => setModalMovimientoVisible(false)} />}
      {modalHerramientasVisible && <FormHerramienta sector={taller} onClose={() => setModalHerramientasVisible(false)} onGuardar={() => setModalHerramientasVisible(false)} />}
      {modalEventosVisible && <ModalEventos tipo="STOCK" onClose={() => setModalEventosVisible(false)} />}
      {modalProveedorVisible && <ModalProveedor onClose={() => setModalProveedorVisible(false)} />}

      <div className="table-options">
        <div className="table-options-group">
          <button className="table-agregar" onClick={() => setModalProveedorVisible(true)}>
            <img src={LogoProveedor} alt="" className="table-logo2" />
            <span className="table-logo-span">Proveedores</span>
          </button>
        </div>
        <div className="table-options-group">
          <button className="table-agregar" onClick={() => setModalHerramientasVisible(true)}>
            <LogoTool className="button-logo" />
          </button>
          <TextButton text="↓↑ MOVIMIENTO" onClick={() => setModalMovimientoVisible(true)} />
          <TextButton text="+ AGREGAR" onClick={() => setModalAgregarVisible(true)} />
        </div>
      </div>
    </section>
  );
};

export default Deposito;

import { useState, useEffect, use } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions";
import { obtenerNombreUnidad } from "../../functions/data-functions";
import "../css/Tables.css";
import FichaStock from "../fichas/FichaStock";
import FormularioStock from "../forms/FormularioStock";
import FormularioMovimientoStock from "../forms/FormularioMovimientoStock";

const TablaStock = () => {
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [articulos, setArticulos] = useState([]);
  const [articulosSeleccionado, setArticuloSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);

  // Cargar personas filtradas por puesto && cant de personas por empresa
  const cargarArticulos = async (usarCache = true) => {
    setLoading(true);
    try {
      const data = await listarColeccion("stock", usarCache);

      setArticulos(data);
    } catch (error) {
      console.error("Error al obtener información desde db: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarArticulos();
  }, []);

  // Abrir ficha articulo
  const handleClickArticulo = (articulo) => {
    setArticuloSeleccionado(articulo);
  };

  // Cerrar ficha o formulario
  const cerrarModal = () => {
    setArticuloSeleccionado(null);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  const cerrarModalMovimiento = () => {
    setModalMovimientoVisible(false);
  };

  // Guardar nuevo articulo o editar existente y recargar lista
  const handleGuardar = async () => {
    await cargarArticulos(false);
    setModalAgregarVisible(false);
    setModalMovimientoVisible(false);
    setArticuloSeleccionado(null);
  };

  // Filtrado simple
  const articulosFiltrados = articulos
    .filter((a) => {
      const nombreCompleto = `${a.id || ""} ${a.codigoProveedor || ""} ${
        a.descripcion || ""
      } ${a.marca} ${a.cantidad} ${a.unidad}`;
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
        <h1 className="table-title">STOCK</h1>
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
        <div className="table-scroll-wrapper">
          <table className="table-lista">
            <thead className="table-titles">
              <tr>
                <th>CODIGO</th>
                <th>DESCRIPCION</th>
                <th>MARCA</th>
                <th>COD. PROVEEDOR</th>
                <th>DISPONIBLE</th>
              </tr>
            </thead>
          </table>

          <div className="table-body-wrapper">
            <table className="table-lista">
              <tbody className="table-body">
                {articulosFiltrados.map((articulo) => (
                  <tr
                    key={articulo.id}
                    onClick={() => handleClickArticulo(articulo)}
                    className="table-item"
                  >
                    <td>{articulo.id}</td>
                    <td>{articulo.descripcion}</td>
                    <td>{articulo.marca}</td>
                    <td>{articulo.codigoProveedor}</td>
                    <td>
                      {articulo.cantidad}{" "}
                      {obtenerNombreUnidad(articulo.unidad).toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {articulosSeleccionado && (
        <FichaStock
          articulo={articulosSeleccionado}
          onClose={cerrarModal}
          onGuardar={handleGuardar}
        />
      )}

      {modalAgregarVisible && (
        <FormularioStock
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
        />
      )}

      {modalMovimientoVisible && (
        <FormularioMovimientoStock
          onClose={cerrarModalMovimiento}
          onGuardar={handleGuardar}
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

export default TablaStock;

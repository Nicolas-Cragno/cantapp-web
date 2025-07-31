import "../css/Forms.css";
import { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import { listarColeccion, sumarCantidadStock } from "../../functions/db-functions";
import { obtenerNombreUnidad } from "../../functions/data-functions";
import { FaCirclePlus } from "react-icons/fa6";


const FormularioMovimientoStock = ({ onClose, onGuardar }) => {
  const [articulos, setArticulos] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

    console.log("Ingresos:", ingresos);


  useEffect(() => {
    const fetchArticulos = async () => {
      const data = await listarColeccion("stock", true);
      setArticulos(data);
      setLoading(false);
    };

    fetchArticulos();
  }, []);

  const handleAgregar = () => {
    if (!articuloSeleccionado || !cantidad || isNaN(cantidad)) {
      Swal.fire("Error", "Selecciona un artículo y una cantidad válida", "warning");
      return;
    }

    const articulo = articulos.find(a => a.id === articuloSeleccionado);

    setIngresos(prev => [
      ...prev,
      {
        id: articulo.id,
        descripcion: articulo.descripcion,
        cantidad: Number(cantidad),
        unidad: articulo.unidad
      }
    ]);

    setArticuloSeleccionado("");
    setCantidad("");
  };

  const handleEliminar = (indexEliminar) => {
    setIngresos(ing => ing.filter((_, i) => i != indexEliminar));
  };

  const handleGuardar = async () => {
    if (ingresos.length === 0) {
      Swal.fire("Atención", "No hay artículos cargados", "info");
      return;
    }

    try {
      for (const item of ingresos) {
        await sumarCantidadStock(item.id, item.cantidad);
      }

      Swal.fire("Éxito", "Stock actualizado correctamente", "success");
      if (onGuardar) onGuardar();
      onClose();
    } catch (err) {
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>ALTA DE STOCK</h2>
        <hr />
        <form>
            <label>
              Artículo
              <select
                value={articuloSeleccionado}
                onChange={(e) => {
                  const idSeleccionado = e.target.value;
                  setArticuloSeleccionado(idSeleccionado);
                  const articulo = articulos.find(a => a.id === idSeleccionado);
                  setUnidad(articulo ? articulo.unidad : "");
                }}
                disabled={loading}
              >
                <option value="">Seleccionar...</option>
                {articulos.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.id} - {art.descripcion} ({art.marca})
                  </option>
                ))}
              </select>
            </label>
            <div className="input-inline">
              <label>
                Cantidad
                <input
                  type="number"
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                  min="1"
                />
              </label>
              <div className="unidad-display">
                <input
                  type="text"
                  value={obtenerNombreUnidad(unidad).toUpperCase()}
                  disabled
                />
                <button className="plus-btn" type="button" onClick={handleAgregar}>
                  <FaCirclePlus className="plus-logo" />
                </button>
              </div>
            </div>
            
            <hr />

            <h4>Movimiento a registrar</h4>
            <div className="form-box">
              {ingresos.length === 0 ? (
                <p>...</p>
              ) : (
                <ul className="list">
                  {ingresos.map((item, index) => (
                    <li key={index} className="list-item">
                      <div className="item-info">
                        <strong>{item.id}</strong> 
                      </div>
                      <div className="item-info">
                        {item.descripcion}
                      </div>
                      <div className="item-actions">
                        <span className="list-cant">+ {item.cantidad} {item.unidad.toUpperCase()}</span>
                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() => handleEliminar(index)}
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-buttons">
                <button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" onClick={onClose} disabled={loading}>
                    Cancelar
                </button>
            </div>
        </form>
        
      </div>
    </div>
  );
};

export default FormularioMovimientoStock;

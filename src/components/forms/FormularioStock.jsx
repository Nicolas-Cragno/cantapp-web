// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useData } from "../../context/DataContext";

// ----------------------------------------------------------------------- imports internos
import { agregar, modificar } from "../../functions/dbFunctions";
import { codigoStock } from "../../functions/dataFunctions";

// -----------------------------------------------------------------------
import Codigos from "../../functions/data/articulos.json";
import Proveedores from "../../functions/data/proveedores.json";
import Medidas from "../../functions/data/unidades.json";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Forms.css";

const FormularioStock = ({ articulo = null, onClose, onGuardar }) => {
  const [cantidad, setCantidad] = useState(0);
  const [proveedor, setProveedor] = useState("");
  const [codigoProveedor, setCodigoProveedor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipo, setTipo] = useState("");
  const [unidad, setUnidad] = useState("Unidades");
  const [loading, setLoading] = useState(false);

  const { stock } = useData();

  const modoEdicion = !!articulo;

  useEffect(() => {
    if (modoEdicion && articulo) {
      setCodigo(articulo.id);
      setCantidad(articulo.cantidad ? articulo.cantidad : 0);
      setCodigoProveedor(
        articulo.codigoProveedor ? articulo.codigoProveedor : ""
      );
      setDescripcion(
        articulo.descripcion ? articulo.descripcion.toUpperCase() : ""
      );
      setMarca(articulo.marca ? articulo.marca.toUpperCase() : "");
      setProveedor(
        articulo.proveedor ? articulo.proveedor.toUpperCase() : "SIN ASIGNAR"
      );
      setTipo(articulo.tipo.toUpperCase());
      setUnidad(articulo.unidad ? articulo.unidad.toUpperCase() : "UNIDADES");
    }
  }, [modoEdicion, articulo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!String(descripcion).trim() || !String(tipo).trim()) {
      Swal.fire({
        title: "Faltan datos",
        text: "Complete los campos obligatorios",
        icon: "question",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      return;
    }

    setLoading(true);

    try {
      if (modoEdicion) {
        const articuloEditado = {
          // cantidad : 0 // se le da stock en otro lado
          codigoProveedor: codigoProveedor.toUpperCase(),
          descripcion: descripcion.toUpperCase(),
          marca: marca.toUpperCase(),
          proveedor: proveedor.toUpperCase(),
          tipo: tipo.toUpperCase(),
          unidad: unidad.toUpperCase(),
        };

        await modificar("stock", articulo.id, articuloEditado);

        if (onGuardar) onGuardar(articuloEditado);
      } else {
        const prefijo = Codigos[tipo.toLowerCase()];
        const codProv = Proveedores[proveedor.toLowerCase()];

        const nuevoArticulo = {
          cantidad: 0, // se le da stock en otro lado
          codigoProveedor: codigoProveedor,
          descripcion: descripcion.toUpperCase(), // siempre en mayusculas
          marca: marca.toUpperCase(),
          proveedor: proveedor.toUpperCase(),
          tipo: tipo.toUpperCase(),
          id: await codigoStock(stock, tipo, prefijo, codProv),
          unidad: Medidas[unidad.toLowerCase()],
        };

        const articuloAgregado = await agregar(
          "stock",
          nuevoArticulo,
          nuevoArticulo.id
        );
        if (onGuardar) onGuardar(articuloAgregado);
      }

      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });

      console.error("Error al guardar articulo: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{modoEdicion ? "MODIFICAR " + tipo.toUpperCase() : "NUEVO"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Tipo
            {modoEdicion ? (
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                disabled
              />
            ) : (
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                disabled={loading || modoEdicion}
              >
                <option value="">Seleccionar...</option>
                {Object.entries(Codigos).map(([nombre]) => (
                  <option key={nombre} value={nombre}>
                    {nombre.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          </label>
          <label>
            Descripción
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
            />
          </label>
          <label>
            Proveedor
            <select
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar...</option>
              {Object.entries(Proveedores).map(([nombre]) => (
                <option key={nombre} value={nombre}>
                  {nombre.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label>
            Código Proveedor
            <input
              type="text"
              value={codigoProveedor}
              onChange={(e) => setCodigo(e.target.value)}
              disabled={loading}
            />
          </label>
          <label>
            Marca
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              disabled={loading}
            />
          </label>
          <label>
            Unidad de medida
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar...</option>
              {Object.entries(Medidas).map(([nombre]) => (
                <option key={nombre} value={nombre}>
                  {nombre.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
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

export default FormularioStock;

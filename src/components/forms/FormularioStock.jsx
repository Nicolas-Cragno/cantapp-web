import "./css/Forms.css";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { agregar, modificar, codigoStock } from "../../functions/db-functions";
import { obtenerNombreUnidad } from "../../functions/data-functions";
import Codigos from "../../functions/data/articulos.json";
import Medidas from "../../functions/data/unidades.json";

const FormularioStock = ({ articulo = null, onClose, onGuardar }) => {
  const [marca, setMarca] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipo, setTipo] = useState("");
  const [unidad, setUnidad] = useState("UN");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const modoEdicion = !!articulo;

  useEffect(() => {
    if (modoEdicion && articulo) {
      setMarca(articulo.marca);
      setCodigo(articulo.codigo);
      setTipo(articulo.tipo);
      setUnidad(obtenerNombreUnidad(articulo.unidad));
      setDescripcion(articulo.descripcion);
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
          tipo: tipo.toUpperCase(),
          descripcion: descripcion.toUpperCase(),
          marca: marca.toUpperCase(),
          unidad: Medidas[unidad.toLowerCase()],
          codigo: codigo || "",
          // cantidad : 0 // se le da stock en otro lado
        };

        await modificar("stock", articulo.id, articuloEditado);

        if (onGuardar) onGuardar(articuloEditado);
      } else {
        const prefijo = Codigos[tipo.toLowerCase()];

        const nuevoArticulo = {
          tipo: tipo.toUpperCase(),
          id: await codigoStock(tipo, prefijo),
          descripcion: descripcion.toUpperCase(),
          marca: marca.toUpperCase(),
          unidad: Medidas[unidad.toLowerCase()],
          codigo: codigo || "",
          cantidad: 0, // se le da stock en otro lado
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
            Código Proveedor
            <input
              type="text"
              value={codigo}
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

// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { agregar, modificar } from "../../functions/dbFunctions";
import { idNuevoProveedor } from "../../functions/dataFunctions";
import "./css/Forms.css";

const FormProveedor = ({ elemento = null, onClose, onGuardar }) => {
  const { proveedores } = useData();
  const [formData, setFormData] = useState({
    nombre: elemento?.nombre || "",
    cuit: elemento?.cuit || "",
    marca: elemento?.marca || "",
    codigo: elemento?.codigo ? elemento.codigo : elemento.id || "",
    detalle: elemento?.detalle || "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (elemento) setModoEdicion(true);
  }, [elemento]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (!modoEdicion) {
        const nuevoProveedor = {
          ...formData,
          nombre: formData.nombre.toUpperCase(),
          cuit: formData.cuit,
          marca: formData.marca.toUpperCase(),
          codigo: idNuevoProveedor(proveedores),
          detalle: formData.detalle.toUpperCase() || "",
        };

        await agregar(
          "proveedores",
          nuevoProveedor,
          String(nuevoProveedor.codigo)
        );
        onGuardar?.(nuevoProveedor);
      } else {
        const proveedorEditado = {
          ...formData,
          nombre: formData.nombre.toUpperCase(),
          cuit: formData.cuit,
          marca: formData.marca.toUpperCase(),
          detalle: formData.detalle.toUpperCase() || "",
        };

        await modificar("proveedores", String(elemento.id), proveedorEditado);

        onGuardar?.(proveedorEditado);
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
      console.error("Error al guardar proveedor: ", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{modoEdicion ? "Editar Proveedor" : "Nuevo Proveedor"}</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <p className="ficha-info-title">
            <strong>Información</strong>
          </p>
          <div className="ficha-info">
            <label>Codigo</label>
            <input
              type="text"
              name="nombre"
              value={formData.codigo}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              disabled={true}
            />
            <label>Nombre legal</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              required
            />

            <label>Nombre marca (abreviación/simplificación)</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              required
            />
            <label>CUIT</label>
            <input
              type="number"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              min="10000000000"
              max="99999999999"
              required
            />
          </div>

          <div className="form-group">
            <label>Detalle</label>
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={uploading}>
              {uploading ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={onClose} disabled={uploading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormProveedor;

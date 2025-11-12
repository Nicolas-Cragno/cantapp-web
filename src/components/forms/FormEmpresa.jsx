// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import InputValidator from "../devs/InputValidator";
import { agregar, modificar } from "../../functions/dbFunctions";
import { verificarDuplicado } from "../../functions/dataFunctions";
import "./css/Forms.css";

const FormEmpresa = ({ empresa = null, onClose, onGuardar }) => {
  const { usuario, empresas } = useData();
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: null,
    detalle: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [esDev, setEsDev] = useState(false);

  useEffect(() => {
    if (usuario.rol === "dev") setEsDev(true);
  }, []);

  useEffect(() => {
    if (empresa) {
      setModoEdicion(true);
      setFormData({
        nombre: empresa.nombre || "",
        cuit: empresa.cuit || "",
        detalle: empresa.detalle || "",
      });
    }
  }, [empresa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const nuevaEmpresa = {
        nombre: formData.nombre.toUpperCase(),
        cuit: formData.cuit,
        detalle: formData.detalle.toUpperCase(),
      };

      if (modoEdicion) {
        await modificar("empresas", String(nuevaEmpresa.cuit), nuevaEmpresa);
      } else {
        await verificarDuplicado(empresas, nuevaEmpresa.cuit);

        await agregar("empresas", nuevaEmpresa, String(nuevaEmpresa.cuit));
      }
      onGuardar?.(nuevaEmpresa);

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
        <h2>{modoEdicion ? "Editar Empresa" : "Registrar Empresa"}</h2>

        <hr />
        <form onSubmit={handleSubmit}>
          <p className="ficha-info-title">
            <strong>Información</strong>
          </p>
          <div className="ficha-info">
            <div className="dev">
              <label>Nombre</label>
              {esDev && <InputValidator campo={formData.nombre} />}
            </div>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              required
            />
            <div className="dev">
              <label>CUIT</label>
              {esDev && <InputValidator campo={formData.cuit} />}
            </div>
            <input
              type="number"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              min="10000000000"
              max="99999999999"
              required
              disabled={modoEdicion}
            />
          </div>

          <div className="form-group">
            <div className="dev">
              <label>Detalle</label>
              {esDev && <InputValidator campo={formData.detalle} />}
            </div>
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

export default FormEmpresa;

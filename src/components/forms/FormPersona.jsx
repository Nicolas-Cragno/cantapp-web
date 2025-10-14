// ----------------------------------------------------------------------- imports externos
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { agregar, modificar } from "../../functions/dbFunctions";
import {
  buscarEmpresa,
  formatearFecha,
  calcularEdad,
  buscarCuitEmpresa,
  verificarDuplicado,
} from "../../functions/dataFunctions";
import puestos from "../../functions/data/puestos.json";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Forms.css";

const FormPersona = ({
  tipoPuesto = null,
  persona = null,
  onClose,
  onGuardar,
}) => {
  const { personas, empresas } = useData();

  const [formData, setFormData] = useState({
    dni: persona?.dni || "",
    apellido: persona?.apellido?.toUpperCase() || "",
    nombres: persona?.nombres?.toUpperCase() || "",
    ubicacion: persona?.ubicacion?.toUpperCase() || "",
    edad: persona?.nacimiento ? calcularEdad(persona.nacimiento) : "",
    empresa: persona?.empresa ? buscarEmpresa(empresas, persona.empresa) : "",
    puesto: persona?.puesto || "",
    ingreso: persona?.ingreso ? formatearFecha(persona.ingreso) : "",
    legajo: persona?.legajo || "",
    sucursal: persona?.sucursal || "",
    estado: persona?.estado ? "Activo" : "Inactivo",
    detalle: persona?.detalle?.toUpperCase() || "",
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (persona) setModoEdicion(true);
  }, [persona]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (modoEdicion) {
        const personaEditada = {
          ...formData,
          apellido: formData.apellido?.toUpperCase() || null,
          nombres: formData.nombres?.toUpperCase() || null,
          ubicacion: formData.ubicacion?.toUpperCase() || null,
          edad: formData.nacimiento ? calcularEdad(formData.nacimiento) : null,
          empresa: formData.empresa
            ? buscarCuitEmpresa(empresas, formData.empresa)
            : null,
          puesto: formData.puesto || null,
          ingreso: formData.ingreso ? formatearFecha(formData.ingreso) : null,
          legajo: formData.legajo || null,
          sucursal: formData.sucursal || null,
          estado: formData.estado === "Activo",
          detalle: formData.detalle?.toUpperCase() || null,
        };

        await modificar("personas", personaEditada.dni, personaEditada);
        onGuardar?.(personaEditada);
      } else {
        if (verificarDuplicado(personas, formData.dni)) {
          Swal.fire({
            title: "Duplicado",
            text: "Ya existe una persona con ese DNI.",
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4161bd",
          });
          setUploading(false);
          return;
        }

        const nuevaPersona = {
          ...formData,
          dni: String(formData.dni),
          apellido: formData.apellido?.toUpperCase() || null,
          nombres: formData.nombres?.toUpperCase() || null,
          ubicacion: formData.ubicacion?.toUpperCase() || null,
          empresa: formData.empresa
            ? buscarCuitEmpresa(empresas, formData.empresa)
            : null,
          puesto: formData.puesto || null,
          ingreso: new Date(),
          legajo: formData.legajo || null,
          sucursal: formData.sucursal || null,
          estado: true,
          detalle: formData.detalle?.toUpperCase() || null,
        };

        await agregar("personas", nuevaPersona, String(nuevaPersona.dni));
        onGuardar?.(nuevaPersona);
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
      console.error("Error al guardar persona:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{modoEdicion ? "Editar Persona" : "Nueva Persona"}</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <p className="ficha-info-title">
            <strong>Información personal</strong>
          </p>
          <div className="ficha-info">
            <label>DNI</label>
            <input
              type="number"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              min="1000000"
              max="99999999"
              disabled={modoEdicion}
              required
            />

            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              required
            />

            <label>Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              required
            />
            <label>Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
            />
          </div>

          <p className="ficha-info-title">
            <strong>Información laboral</strong>
          </p>
          <div className="ficha-info">
            <label>Empresa</label>
            <select
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              disabled={uploading}
            >
              <option value="">Seleccionar empresa...</option>
              {empresas
                .filter((e) => e.tipo === "propia")
                .map((e) => (
                  <option key={e.cuit} value={e.nombre}>
                    {e.nombre}
                  </option>
                ))}
            </select>

            <label>Puesto</label>
            <select
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              disabled={uploading}
            >
              <option value="">Seleccionar puesto...</option>
              {puestos.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
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

export default FormPersona;

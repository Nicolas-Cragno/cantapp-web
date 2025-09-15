// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { verificarDni, agregar, modificar } from "../../functions/db-functions";
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
  const { personas, empresas, sectores } = useData();

  const [formData, setFormData] = useState({
    // informacion personal
    dni: persona && persona.dni ? Number(persona.dni) : "",
    apellido: persona && persona.apellido ? String(persona.apellido) : "",
    nombres: persona && persona.nombres ? String(persona.nombres) : "",
    nacimiento:
      persona && persona.nacimiento ? formatearFecha(persona.nacimiento) : "",
    ubicacion: persona && persona.ubicacion ? String(persona.ubicacion) : "",
    edad: persona && persona.nacimiento ? calcularEdad(persona.nacimiento) : "",
    // información laboral
    empresa:
      persona && persona.empresa
        ? buscarEmpresa(empresas, persona.empresa)
        : "",
    puesto: persona && persona.puesto ? String(persona.puesto) : "",
    ingreso: persona && persona.ingreso ? formatearFecha(persona.ingreso) : "",
    legajo: persona && persona.legajo ? Number(persona.legajo) : "",
    sucursal: persona && persona.sucursal ? String(persona.sucursal) : "",
    estado: persona && persona.estado ? "Activo" : "Inactivo",
    detalle: persona && persona.detalle ? String(persona.detalle) : "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (persona) setModoEdicion(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...ProgressEvent, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (modoEdicion) {
        const personaEditada = {
          ...formData,
          // informacion personal
          apellido: formData.apellido ? String(formData.apellido) : null,
          nombres: formData.nombres ? String(formData.nombres) : null,
          nacimiento: formData.nacimiento
            ? formatearFecha(formData.nacimiento)
            : null,
          ubicacion: formData.ubicacion ? String(formData.ubicacion) : null,
          edad: formData.nacimiento ? calcularEdad(formData.nacimiento) : null,
          // información laboral
          empresa: formData.empresa
            ? buscarCuitEmpresa(formData.empresa)
            : null,
          puesto: formData.puesto ? String(formData.puesto) : null,
          ingreso: formData.ingreso ? formatearFecha(formData.ingreso) : null,
          legajo: formData.legajo ? Number(formData.legajo) : null,
          sucursal: formData.sucursal ? String(formData.sucursal) : null,
          estado: formData.estado ? true : false,
          detalle: formData.detalle ? String(formData.detalle) : null,
        };

        await modificar(personas, personaEditada.dni, personaEditada);
        if (onGuardar) onGuardar(personaEditada);
      } else {
        const existeDni = verificarDuplicado(personas, formData.dni);

        if (existeDni) {
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
          // informacion personal

          dni: formData.dni && Number(formData.dni), // si no se completa no se puede cargar (filtro desde return)
          apellido: formData.apellido ? String(formData.apellido) : null,
          nombres: formData.nombres ? String(formData.nombres) : null,
          nacimiento: formData.nacimiento
            ? formatearFecha(formData.nacimiento)
            : null,
          ubicacion: formData.ubicacion ? String(formData.ubicacion) : null,
          edad: formData.nacimiento ? calcularEdad(formData.nacimiento) : null,
          // información laboral
          empresa: formData.empresa
            ? buscarCuitEmpresa(formData.empresa)
            : null,
          puesto: formData.puesto ? String(formData.puesto) : null,
          ingreso: formData.ingreso ? formatearFecha(formData.ingreso) : null,
          legajo: formData.legajo ? Number(formData.legajo) : null,
          sucursal: formData.sucursal ? String(formData.sucursal) : null,
          estado: formData.estado ? true : false,
          detalle: formData.detalle ? String(formData.detalle) : null,
        };

        await agregar(personas, nuevaPersona, nuevaPersona.dni);
        if (onGuardar) onGuardar(nuevaPersona);
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
              min="1000000" // mínimo 7 cifras
              max="99999999" // máximo 8 cifras
              disabled={modoEdicion} // el DNI no se edita
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
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="nacimiento"
              value={formData.nacimiento}
              onChange={handleChange}
            />
          </div>

          <p className="ficha-info-title">
            <strong>Información laboral</strong>
          </p>
          <div className="ficha-info">
            <label>Empresa</label>
            <select
              value={formData.empresa}
              onChange={handleChange}
              disabled={uploading}
            >
              <option value="">Seleccionar empresa...</option>
              {empresas
                .filter((empresa) => empresa.tipo === "propia")
                .map((empresa) => (
                  <option key={empresa.cuit} value={empresa.nombre}>
                    {empresa.nombre}
                  </option>
                ))}
            </select>

            <label>Puesto</label>
            <select
              value={formData.puesto}
              onChange={handleChange}
              disabled={uploading}
            >
              <option value="">Seleccionar puesto...</option>
              {puestos.map((p, index) => (
                <option key={index} value={p}>
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

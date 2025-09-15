import { useState, useEffect } from "react";
import "./css/Forms.css";
import empresas from "../../functions/data/empresas.json";
import Swal from "sweetalert2";
import { verificarDni, agregar, modificar } from "../../functions/db-functions";
import {
  nombreEmpresa,
  obtenerCuitPorNombre,
} from "../../functions/data-functions";

const FormularioPersona = ({
  tipoPuesto,
  persona = null,
  onClose,
  onGuardar,
}) => {
  const [dni, setDni] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombres, setNombres] = useState("");
  const [empresa, setEmpresa] = useState("SIN ASIGNAR");
  const [detalle, setDetalle] = useState("");
  const [puesto] = useState(tipoPuesto);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const modoEdicion = !!persona;

  useEffect(() => {
    if (modoEdicion && persona) {
      setDni(persona.dni);
      setApellido(persona.apellido);
      setNombres(persona.nombres);
      setEmpresa(nombreEmpresa(persona.empresa));
      setDetalle(persona.detalle);
    }
  }, [modoEdicion, persona]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (!apellido.trim() || !nombres.trim() || !String(dni).trim()) {
      Swal.fire({
        title: "Faltan datos",
        text: "Complete los campos obligatorios.",
        icon: "question",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      return;
    }

    setLoading(true);

    try {
      if (modoEdicion) {
        const personaEditada = {
          dni,
          apellido: apellido.toUpperCase(),
          nombres: nombres.toUpperCase(),
          empresa: obtenerCuitPorNombre(empresa?.toUpperCase() || "") || "",
          puesto,
          detalle: detalle.toUpperCase(),
          ingreso: persona.ingreso || new Date(),
        };

        await modificar("personas", persona.dni, personaEditada);
        if (onGuardar) onGuardar(personaEditada);
      } else {
        const existeDni = await verificarDni(dni);

        if (existeDni) {
          Swal.fire({
            title: "Duplicado",
            text: "Ya existe una persona con ese DNI.",
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4161bd",
          });
          setLoading(false);
          return;
        }

        const nuevaPersona = {
          dni,
          apellido: apellido.toUpperCase(),
          nombres: nombres.toUpperCase(),
          empresa: obtenerCuitPorNombre(empresa),
          puesto,
          detalle: detalle.toUpperCase(),
          ingreso: new Date(),
        };

        const personaAgregada = await agregar("personas", nuevaPersona, dni);
        if (onGuardar) onGuardar(personaAgregada);
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
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>
          {modoEdicion ? "MODIFICAR" : "NUEVO"} {tipoPuesto}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            DNI
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={10}
              value={dni}
              placeholder="Ingrese sin puntos"
              onChange={(e) => setDni(e.target.value)}
              disabled={modoEdicion || loading}
            />
          </label>
          <label>
            Apellido
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              disabled={loading}
            />
          </label>
          <label>
            Nombres
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              disabled={loading}
            />
          </label>
          <label>
            Empresa
            <select
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccionar empresa...</option>
              {Object.entries(empresas).map(([cuit, nombre]) => (
                <option key={cuit} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Puesto
            <input
              type="text"
              value={puesto}
              readOnly
              className="input-readonly"
            />
          </label>
          <label>
            Detalle
            <textarea
              type="text"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              disabled={loading}
            />
          </label>
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

export default FormularioPersona;

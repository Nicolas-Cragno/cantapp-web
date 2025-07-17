import { useState } from "react";
import '../css/Forms.css';
import puestos from "../../functions/data/puestos.json";
import empresas from "../../functions/data/empresas.json";
import { verificarDni, agregar } from "../../functions/db-functions";

const FormularioPersona = ({ tipoPuesto, onClose, onGuardar }) => {
  const [documento, setDocumento] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombres, setNombres] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [detalle, setDetalle] = useState("");
  const [puesto] = useState(tipoPuesto);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!apellido.trim() || !nombres.trim() || !documento.trim()) {
      alert("Complete los datos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const existeDni = await verificarDni(documento);

      if (existeDni) {
        alert("Ya existe una persona con ese DNI.");
        setLoading(false);
        return;
      }

      const nuevaPersona = {
        documento,
        apellido: apellido.toUpperCase(),
        nombres: nombres.toUpperCase(),
        empresa,
        puesto,
        detalle: detalle.toUpperCase(),
        ingreso: new Date()
      };

      const personaAgregada = await agregar("personas", nuevaPersona, documento); // Esperar respuesta de Firestore
      if (onGuardar) onGuardar(personaAgregada); // informar al padre
      onClose(); // cerrar modal

    } catch (error) {
      alert("Ocurrió un error al guardar la persona. Revisá la consola.");
      console.error("Error al guardar persona:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>NUEVO {tipoPuesto}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            DNI
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={10}
              value={documento}
              placeholder="Ingrese sin puntos"
              onChange={(e) => setDocumento(e.target.value)}
              disabled={loading}
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

export default FormularioPersona;

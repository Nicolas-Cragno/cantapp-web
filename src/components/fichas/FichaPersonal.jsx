import "../css/Fichas.css";
import { nombreEmpresa, formatearFecha } from "../../functions/data-functions";
import { useState } from "react";
import FormularioPersona from "../forms/FormularioPersona";

const FichaPersonal = ({ persona, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  if (!persona) return null;

  const empresa = nombreEmpresa(persona.empresa);
  const fechaIngreso = formatearFecha(persona.ingreso);

  const handleGuardado = async (personaModificada) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(personaModificada);
  };

  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}>
              ✕
            </button>
                <h1 className="person-name">
                    <strong className="apellido">{persona.apellido}</strong>
                    <span className="nombres">{persona.nombres}</span>
                </h1>
                <hr />
                <p className="puesto"><strong>{persona.puesto}</strong></p>
            <div className="ficha-info">
                <p><strong>DNI: </strong> {persona.dni || "No especificado"}</p>
                <p><strong>Empresa: </strong> {empresa}</p>
                <p><strong>Ingreso: </strong> {fechaIngreso || ""}</p>
                <p><strong>Detalle: </strong> {persona.detalle || ""}</p>
            </div>
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Modificar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormularioPersona
          tipoPuesto={persona.puesto}
          persona={persona}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaPersonal;

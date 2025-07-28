import "../css/Fichas.css";
import { nombreEmpresa, formatearFecha } from "../../functions/data-functions";
import { useState } from "react";
import FormularioPersona from "../forms/FormularioPersona";
import LogoEmpresa from "../LogoEmpresa";

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
                <div className="info-right">
                  <p><strong>DNI </strong> {persona.dni || persona.id}</p>
                </div>
                <p className="ficha-info-title"><strong>Información laboral</strong></p>
                <div className="ficha-info container">
                  <div className="row">
                    <div className="col-md-9">
                      <p className="ficha-info-item"><strong>Empresa</strong> <spam className="ficha-info-item-txt">{nombreEmpresa(persona.empresa)}</spam></p>
                      <p className="ficha-info-item"><strong>Ingreso</strong> <spam className="ficha-info-item-txt">{fechaIngreso || ""}</spam></p>
                      <p className="ficha-info-item"><strong>Puesto</strong> <spam className="ficha-info-item-txt">{persona.puesto}</spam></p>
                    </div>
                    <div className="col-md-3 col-img">
                      <LogoEmpresa cuitEmpresa={persona.empresa}/>
                    </div>
                  </div>
                </div>
                <p className="ficha-info-title"><strong>Detalle</strong></p>
                <div className="ficha-info">
                    <p>{persona.detalle || ""}</p>
                </div>
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
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

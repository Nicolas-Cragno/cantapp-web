// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import {
  buscarEmpresa,
  formatearFecha,
  calcularEdad,
} from "../../functions/dataFunctions";
import TablaEventosReducida from "../tablas/TablaEventosReducida";
import FormPersona from "../forms/FormPersona";
// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Fichas.css";
import LogoEmpresa from "../logos/LogoEmpresa";

const FichaPersonal = ({ persona, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const { empresas } = useData();

  if (!persona) return null;
  const fechaNacimiento = formatearFecha(persona.nacimiento);
  const fechaIngreso = formatearFecha(persona.ingreso);
  const edad = calcularEdad(persona.nacimiento);

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
            <div className="info-subname">
              <p className="info-minitext">{edad ? edad + " años" : null}</p>
            </div>
            <p className="ficha-info-title">
              <strong>Información Personal</strong>
            </p>
            <div className="ficha-info container">
              <div className="row">
                <p className="ficha-info-item">
                  <strong>Nro DNI </strong>{" "}
                  <span className="ficha-info-item-txt">
                    {persona.dni || persona.id}
                  </span>
                </p>
                <p className="ficha-info-item">
                  <strong>Fecha nac.</strong>{" "}
                  <span className="ficha-info-item-txt">{fechaNacimiento}</span>{" "}
                  {edad ? (
                    <span className="ficha-info-item-txt2">{edad} años</span>
                  ) : null}
                </p>
                <p className="ficha-info-item">
                  <strong>Ubicación</strong>{" "}
                  <span className="ficha-info-item-txt">
                    {persona.ubicacion}
                  </span>
                </p>
              </div>
            </div>
            <p className="ficha-info-title">
              <strong>Información laboral</strong>
            </p>
            <div className="ficha-info container">
              <div className="row">
                <div className="col-md-9">
                  <p className="ficha-info-item">
                    <strong>Empresa</strong>{" "}
                    <span className="ficha-info-item-txt">
                      {buscarEmpresa(empresas, persona.empresa)}
                    </span>
                  </p>
                  <p className="ficha-info-item">
                    <strong>Ingreso</strong>{" "}
                    <span className="ficha-info-item-txt">
                      {fechaIngreso || ""}
                    </span>
                  </p>
                  <p className="ficha-info-item">
                    <strong>Puesto</strong>{" "}
                    <span className="ficha-info-item-txt">
                      {persona.puesto}
                    </span>
                  </p>
                  <p className="ficha-info-item">
                    <strong>Sucursal</strong>{" "}
                    <span className="ficha-info-item-txt">
                      {persona.sucursal}
                    </span>
                  </p>
                </div>
                <div className="col-md-3 col-img">
                  <LogoEmpresa cuitEmpresa={persona.empresa} />
                </div>
              </div>
            </div>
            {persona.detalle ? (
              <>
                <p className="ficha-info-title">
                  <strong>Detalle</strong>
                </p>
                <div className="ficha-info">
                  <p>{persona.detalle || ""}</p>
                </div>
              </>
            ) : null}
            <TablaEventosReducida
              tipoColeccion={"persona"}
              identificador={persona.dni}
            />

            {onGuardar ? (
              <div className="ficha-buttons">
                <button onClick={() => setModoEdicion(true)}>Editar</button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <FormPersona
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

import "../css/Fichas.css";
import { nombreEmpresa, formatearFecha } from "../../functions/data-functions";
import { listarColeccion } from "../../functions/db-functions";
import { useEffect, useState } from "react";

import FormularioPersona from "../forms/FormularioPersona";
import LogoEmpresa from "../LogoEmpresa";

const FichaPersonal = ({ persona, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const listaEventos = await listarColeccion("eventos", true);
        const listaFiltrada = listaEventos.filter(
          (e) => e.persona === persona.dni
        );

        setEventos(listaFiltrada);
        console.log("Carga de eventos realizada");
      } catch (error) {
        console.log("Error al cargar eventos de la persona: ", error);
      }
    };

    if (persona?.dni) {
      cargarEventos();
    }
  }, [persona?.dni]);

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
              <p>
                <strong>DNI </strong> {persona.dni || persona.id}
              </p>
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
                      {nombreEmpresa(persona.empresa)}
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
                </div>
                <div className="col-md-3 col-img">
                  <LogoEmpresa cuitEmpresa={persona.empresa} />
                </div>
              </div>
            </div>
            <p className="ficha-info-title">
              <strong>Detalle</strong>
            </p>
            <div className="ficha-info">
              <p>{persona.detalle || ""}</p>
            </div>
            {eventos.length > 0 ? (
              <div className="ficha-info">
                {eventos.map((evento, index) => (
                  <div key={index} className="eventopersona-item">
                    <strong>
                      <span key={index}>{formatearFecha(evento.fecha)}</span>
                    </strong>
                    <span>{evento.subtipo}</span>
                    {evento.tractor ? (
                      <span>(tractor {evento.tractor})</span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
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

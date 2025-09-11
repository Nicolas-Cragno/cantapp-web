import "./css/Fichas.css";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import { useEffect, useState } from "react";
import FormularioLlavePorteria from "../forms/FormularioLlavePorteria";
import {
  buscarNombrePorDni,
  listarColeccion,
  modificar,
} from "../../functions/db-functions";
import { FaKey } from "react-icons/fa";
import { TbChecklist } from "react-icons/tb";

const FichaLlavePorteria = ({ evento, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombrePersona, setNombrePersona] = useState("SIN ASIGNAR");
  const [nombreOperador, setNombreOperador] = useState("SIN ASIGNAR");
  const [tractoresNombres, setTractoresNombres] = useState([]);
  const [modificaciones, setModificaciones] = useState([]);

  const fechaFormateada = formatearFecha(evento?.fecha);
  const horaFormateada = formatearHora(evento?.fecha);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!evento) return;

      // Persona
      if (evento.persona) {
        const nombre = await buscarNombrePorDni(evento.persona);
        setNombrePersona(nombre);
      }

      // Operador
      if (evento.operador) {
        const nombre = await buscarNombrePorDni(evento.operador);
        setNombreOperador(nombre);
      }

      // Modificaciones
      let modificacionesArray = [];
      if (
        evento.modificaciones != undefined &&
        evento.modificaciones !== null
      ) {
        modificacionesArray = Array.isArray(evento.modificaciones)
          ? evento.modificaciones
          : [evento.modificaciones];
      }

      setModificaciones(modificacionesArray);

      // Tractores (normalizamos a array aunque venga un solo valor)
      let tractoresArray = [];
      if (evento.tractor !== undefined && evento.tractor !== null) {
        tractoresArray = Array.isArray(evento.tractor)
          ? evento.tractor
          : [evento.tractor]; // si es un solo valor, lo convertimos a array
      }

      if (tractoresArray.length > 0) {
        const tractores = await listarColeccion("tractores");
        const nombresTractores = tractoresArray
          .map((int) => {
            const t = tractores.find((tr) => tr.interno === int);
            return t ? `${t.dominio} (${t.interno})` : null;
          })
          .filter(Boolean);
        setTractoresNombres(nombresTractores);
      }
    };

    cargarDatos();
  }, [evento]);

  if (!evento) return null;

  const handleGuardado = async (eventoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(eventoModificado);
  };

  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}>
              ✕
            </button>
            <h1 className="event-subtipo">
              {evento.id ? evento.id : "REGISTRO DE LLAVES"}
            </h1>
            <hr />
            <div className="hora">
              <span>{fechaFormateada}</span>
              <span>{horaFormateada} HS</span>
            </div>
            <div className="ficha-info">
              <p className="ficha-type">
                <strong>
                  {evento.tipo === "RETIRA" ? (
                    <>
                      <FaKey className="ficha-type-logo" /> RETIRA LLAVES
                    </>
                  ) : evento.tipo === "ENTREGA" || evento.tipo === "DEJA" ? (
                    <>
                      <FaKey className="ficha-type-logo" />
                      ENTREGA LLAVES
                    </>
                  ) : evento.tipo === "INVENTARIO" ? (
                    <>
                      <TbChecklist className="ficha-type-logo" />
                      INVENTARIO DE LLAVES
                    </>
                  ) : null}
                </strong>
              </p>
              <p>
                <strong>Persona: </strong> {nombrePersona}
              </p>
              <p>
                <strong>Operador: </strong> {nombreOperador}
              </p>
              <p>
                <strong>Tractor: </strong>{" "}
                {tractoresNombres.length > 0
                  ? tractoresNombres.join(", ")
                  : "SIN ASIGNAR"}
                {evento.parteTr ? (
                  <>
                    <span className="infobox blackbox">DEJÓ PARTE</span>{" "}
                  </>
                ) : null}
              </p>
              <p>
                <strong>Detalle: </strong> {evento.detalle || "-"}
              </p>
            </div>
            <div className="ficha-data">
              {evento.usuario ? (
                <p>
                  Cargado por <strong>{evento.usuario}</strong>
                </p>
              ) : (
                " "
              )}
            </div>
            {modificaciones.length > 0 && (
              <>
                <p className="ficha-info-title">
                  <strong>Modificaciones</strong>
                </p>
                <div className="ficha-info container">
                  {modificaciones.map((mod, index) => (
                    <p key={index} className="item-list">
                      <strong>{mod.usuario}</strong>
                      {" ("}
                      {formatearFecha(mod.fecha)} {formatearHora(mod.fecha)}
                      {" hs)"}
                    </p>
                  ))}
                </div>
              </>
            )}

            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormularioLlavePorteria
          evento={evento}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaLlavePorteria;

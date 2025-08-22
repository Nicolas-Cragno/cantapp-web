import "./css/Fichas.css";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import { useEffect, useState } from "react";
import FormularioLlavePorteria from "../forms/FormularioLlavePorteria";
import {
  buscarNombrePorDni,
  listarColeccion,
} from "../../functions/db-functions";

const FichaLlavePorteria = ({ evento, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombrePersona, setNombrePersona] = useState("SIN ASIGNAR");
  const [nombreOperador, setNombreOperador] = useState("SIN ASIGNAR");
  const [tractor, setTractor] = useState("SIN ASIGNAR");

  const fechaFormateada = formatearFecha(evento.fecha);
  const horaFormateada = formatearHora(evento.fecha);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!evento) return null;

      if (evento.persona) {
        const nombre = await buscarNombrePorDni(evento.persona);
        setNombrePersona(nombre);
      }

      if (evento.operador) {
        const nombre = await buscarNombrePorDni(evento.operador);
        setNombreOperador(nombre);
      }
      if (evento.tractor) {
        const tractores = await listarColeccion("tractores");
        const dTractor = tractores.find((t) => t.interno === evento.tractor);
        if (dTractor) {
          setTractor(`${dTractor.dominio} (${dTractor.interno})`);
        }
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
            <h1 className="event-subtipo">Registro de llaves</h1>
            <hr />
            <div className="hora">
              <spam>{fechaFormateada}</spam>
              <spam>{horaFormateada} HS</spam>
            </div>
            <div className="ficha-info">
              <p>
                <strong>Persona: </strong> {nombrePersona}
              </p>
              <p>
                <strong>Operador: </strong> {nombreOperador}
              </p>
              <p>
                <strong>Tractor: </strong>
                {tractor}
              </p>
              <p>
                <strong>Detalle: </strong> {evento.detalle || "-"}
              </p>
            </div>

            <div className="ficha-data">
              {evento.usuario ? (
                <p>
                  Cargado por <strong>{evento.usuario}</strong>{" "}
                </p>
              ) : (
                " "
              )}
            </div>
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

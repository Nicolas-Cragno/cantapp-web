// ----------------------------------------------------------------------- imports externos
import { useData } from "../../context/DataContext";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------- imports internos
import {
  formatearFecha,
  formatearHora,
  buscarPersona,
} from "../../functions/dataFunctions";
import FormEventoSatelital from "../forms/FormEventoSatelital";
import "./css/Fichas.css";

const FichaEventoSatelital = ({ elemento, onClose, onGuardar }) => {
  const evento = elemento;
  const { personas, tractores, furgones } = useData();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState("SIN ASIGNAR");
  const [tractor, setTractor] = useState("SIN ASIGNAR");
  const [furgon, setFurgon] = useState("SIN ASIGNAR");
  const fechaFormateada = formatearFecha(evento.fecha);
  const horaFormateada = formatearHora(evento.fecha);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!evento) return null;

      if (evento.persona) {
        const nombrePersona = await buscarPersona(personas, evento.persona);
        setNombre(nombrePersona);
      }

      if (evento.tractor) {
        const dTractor = tractores.find(
          (t) => String(t.interno) === String(evento.tractor)
        );
        if (dTractor) {
          setTractor(`${dTractor.dominio} (${dTractor.interno})`);
        }
      }

      if (evento.furgon) {
        const dFurgon = furgones.find(
          (f) => String(f.interno) === String(evento.furgon)
        );
        if (dFurgon) {
          setFurgon(`${dFurgon.dominio} (${dFurgon.interno})`);
        }
      }

      console.log(`  ~ Carga de la ficha del evento ${elemento.id}  ✓️`);
    };
    cargarDatos();
  }, [evento]);

  if (!evento) return null;

  const handleGuardado = async (eventoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(eventoModificado);
    console.log(`  ~ Se guardan cambios del evento ${elemento.id}  ✓️`);
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
              {evento.id ? evento.id : "EVENTO"}
            </h1>
            <hr />
            <div className="hora">
              <spam>{fechaFormateada}</spam>
              <spam>{horaFormateada} HS</spam>
            </div>
            <div className="ficha-info">
              <p>
                <strong>Tipo: </strong> {evento.tipo}
              </p>
              <p>
                <strong>Persona: </strong> {nombre}
              </p>
              <p>
                <strong>Tractor: </strong>
                {tractor}
              </p>
              <p>
                <strong>Furgón: </strong>
                {furgon}
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
        <FormEventoSatelital
          evento={evento}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaEventoSatelital;

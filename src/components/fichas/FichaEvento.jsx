import "../css/Fichas.css";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import { useEffect, useState } from "react";
import FormularioEvento from "../forms/FormularioEvento";
import { buscarNombrePorDni, listarColeccion } from "../../functions/db-functions";

const FichaEvento = ({ evento, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState("SIN ASIGNAR");
  const [tractor, setTractor] = useState("SIN ASIGNAR");
  const [furgon, setFurgon] = useState("SIN ASIGNAR");

  const fechaFormateada = formatearFecha(evento.fecha);
  const horaFormateada = formatearHora(evento.fecha);
  
  useEffect(() => {
    const cargarDatos = async () => {
      if(!evento) return null;

      if(evento.persona){
        const nombrePersona = await buscarNombrePorDni(evento.persona);
        setNombre(nombrePersona);
      }

      if(evento.tractor){
        const tractores = await listarColeccion("tractores");
        const dTractor = tractores.find(t => t.interno === evento.tractor);
        if (dTractor) {
          setTractor(`${dTractor.dominio} (${dTractor.interno})`);
        }
      }

      if(evento.furgon){
        const furgones = await listarColeccion("furgones");
        const dFurgon = furgones.find(f => f.interno === evento.furgon);
        if (dFurgon) {
          setFurgon(`${dFurgon.dominio} (${dFurgon.interno})`);
        }
      }
    };
    cargarDatos();
  }, [evento]);

  if(!evento) return null;

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
            <h1 className="event-subtipo">{evento.area ? ("EVENTO " + evento.area) : ("EVENTO")}</h1>
            <hr />
            <div className="hora">
              <spam>{fechaFormateada}</spam>
              <spam>{horaFormateada} HS</spam>
            </div>
            <div className="ficha-info">
              <p><strong>Persona: </strong> {nombre}</p>
              <p><strong>Tractor: </strong>{tractor}</p>
              <p><strong>Furgón: </strong>{furgon}</p>
              <p><strong>Detalle: </strong> {evento.detalle || "-"}</p>
            </div>
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormularioEvento
          evento={evento}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaEvento;

// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
import { FaKey } from "react-icons/fa";
import { IoEnterSharp } from "react-icons/io5";
import { IoLogOutSharp } from "react-icons/io5";
import { FaRoute } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";
// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Tables.css";

const TablaEventosReducida = ({ tipoColeccion, identificador }) => {
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const { eventos } = useData();
  let eventosFiltrados;
  switch (tipoColeccion.toLowerCase()) {
    case "persona":
      eventosFiltrados = eventos.filter((e) => e.persona === identificador);
      break;
    case "tractor":
      eventosFiltrados = eventos.filter((e) => e.tractor === identificador);
      break;
    case "furgon":
      eventosFiltrados = eventos.filter((e) => e.furgon === identificador);
      break;
    case "vehiculo":
      eventosFiltrados = eventos.filter((e) => e.vehiculo === identificador);
      break;
    default:
      eventosFiltrados = null;
  }

  const eventosOrdenados = eventosFiltrados?.sort((a, b) => b.fecha - a.fecha);

  const logoSize = 18;
  const logos = {
    RETIRA: <FaKey size={logoSize} />,
    ENTREGA: <FaKey size={logoSize} />,
    DEJA: <FaKey size={logoSize} />,
    ENTRADA: <IoEnterSharp size={logoSize} />,
    SALIDA: <IoLogOutSharp size={logoSize} />,
    VIAJE: <FaRoute size={logoSize} />,
    OTRO: <MdEventNote size={logoSize} />,
  };

  return (
    <>
      {eventosOrdenados.length > 0 ? (
        <>
          <p className="ficha-info-title">
            <strong>Eventos relacionados</strong>
          </p>
          <div className="ficha-info-box">
            {eventosOrdenados.map((e) => (
              <p
                key={e.id}
                className="item-list"
                onClick={() => setEventoSeleccionado(e)}
              >
                {logos[e.tipo.toUpperCase()]}
                <span>{e.tipo.toUpperCase()}</span>
                <span>
                  {formatearFecha(e.fecha)} | {formatearHora(e.fecha)} hs
                </span>{" "}
              </p>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
};

export default TablaEventosReducida;

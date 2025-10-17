// ----------------------------------------------------------------------- imports externos
import {
  FaKey,
  FaRoute,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
} from "react-icons/fa";
import { IoEnterSharp, IoLogOutSharp } from "react-icons/io5";
import { MdEventNote } from "react-icons/md";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- visuales
import "./css/Tables.css";

const TablaEventosReducida = ({ tipoColeccion, identificador, onRowClick }) => {
  const { eventos } = useData();

  let eventosFiltrados = [];
  switch (tipoColeccion.toLowerCase()) {
    case "persona":
      eventosFiltrados = eventos.filter(
        (e) =>
          e.persona === String(identificador) ||
          e.persona === Number(identificador)
      );
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
      eventosFiltrados = [];
  }

  const eventosOrdenados = eventosFiltrados.sort((a, b) => b.fecha - a.fecha);

  const logoSize = 18;
  const logos = {
    RETIRA: <FaKey size={logoSize} />,
    ENTREGA: <FaKey size={logoSize} />,
    DEJA: <FaKey size={logoSize} />,
    ENTRADA: <IoEnterSharp size={logoSize} />,
    SALIDA: <IoLogOutSharp size={logoSize} />,
    VIAJE: <FaRoute size={logoSize} />,
    OTRO: <MdEventNote size={logoSize} />,
    BAJA: <FaArrowAltCircleDown size={logoSize} />,
    ALTA: <FaArrowAltCircleUp size={logoSize} />,
  };

  if (!eventosOrdenados.length) return null;

  return (
    <>
      <p className="ficha-info-title">
        <strong>Eventos relacionados</strong>
      </p>
      <div className="ficha-info-box">
        {eventosOrdenados.map((e) => (
          <p
            key={e.id}
            className="item-list"
            onClick={() => onRowClick && onRowClick(e)}
          >
            {logos[e.tipo.toUpperCase()] || <MdEventNote size={logoSize} />}
            <span>{e.tipo.toUpperCase()}</span>
            <span>
              {formatearFecha(e.fecha)} | {formatearHora(e.fecha)} hs
            </span>
          </p>
        ))}
      </div>
    </>
  );
};

export default TablaEventosReducida;

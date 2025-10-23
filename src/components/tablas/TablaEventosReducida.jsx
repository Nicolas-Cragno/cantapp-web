// ----------------------------------------------------------------------- imports externos
import {
  FaKey as LogoKey,
  FaRoute as LogoRoute,
  FaArrowAltCircleUp as LogoUp,
  FaArrowAltCircleDown as LogoDown,
} from "react-icons/fa";
import {
  IoEnterSharp as LogoEnter,
  IoLogOutSharp as LogoOut,
} from "react-icons/io5";
import { MdEventNote as LogoNote } from "react-icons/md";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";
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
    RETIRA: <LogoKey size={logoSize} />,
    ENTREGA: <LogoKey size={logoSize} />,
    DEJA: <LogoKey size={logoSize} />,
    ENTRADA: <LogoEnter size={logoSize} />,
    SALIDA: <LogoOut size={logoSize} />,
    VIAJE: <LogoRoute size={logoSize} />,
    OTRO: <LogoNote size={logoSize} />,
    BAJA: <LogoDown size={logoSize} />,
    ALTA: <LogoUp size={logoSize} />,
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
            {logos[e.tipo.toUpperCase()] || <LogoNote size={logoSize} />}
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

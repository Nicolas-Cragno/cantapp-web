// ----------------------------------------------------------------------- imports externos
import { FaKey as LogoKey } from "react-icons/fa6";
import {
  IoEnterSharp as LogoEnter,
  IoExitSharp as LogoExit,
} from "react-icons/io5";
import { IoIosAlert as LogoAlert } from "react-icons/io";

// ----------------------------------------------------------------------- imports internos
import "./css/Logos.css";

const LogoEvento = ({ tipoEvento }) => {
  const logos = {
    DEJA: <LogoKey />,
    ENTREGA: <LogoKey />,
    RETIRA: <LogoKey />,
    ENTRADA: <LogoEnter />,
    SALIDA: <LogoExit />,
  };

  const evento = tipoEvento.toUpperCase();

  const logo = logos[evento] || <LogoAlert />;

  return <div className="logo-evento">{logo}</div>;
};

export default LogoEvento;

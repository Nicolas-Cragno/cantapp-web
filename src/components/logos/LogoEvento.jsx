import { FaKey } from "react-icons/fa6";
import { IoEnterSharp } from "react-icons/io5";
import { IoExitSharp } from "react-icons/io5";
import { IoIosAlert } from "react-icons/io";

import "./css/Logos.css";

const LogoEvento = ({ tipoEvento }) => {
  const logos = {
    DEJA: <FaKey />,
    ENTREGA: <FaKey />,
    RETIRA: <FaKey />,
    ENTRADA: <IoEnterSharp />,
    SALIDA: <IoExitSharp />,
  };

  const evento = tipoEvento.toUpperCase();

  const logo = logos[evento] || <IoIosAlert />;

  return <div className="logo-evento">{logo}</div>;
};

export default LogoEvento;

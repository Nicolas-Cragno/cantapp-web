import "./css/Buttons.css";
import { IoMdAlert } from "react-icons/io";
import { IoRefreshCircle } from "react-icons/io5";

const AlertButton = ({ onClick }) => {
  return (
    <button className="alert-btn" onClick={onClick}>
      <span className="btn-text visible">
        <IoMdAlert />
        Hay nuevos ingresos
      </span>
      <span className="btn-text hidden">
        <IoRefreshCircle />
        Actualizar
      </span>
    </button>
  );
};

export default AlertButton;

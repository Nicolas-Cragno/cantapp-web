import "./css/Buttons.css";
import { IoMdAlert } from "react-icons/io";
import { IoRefreshCircle } from "react-icons/io5";

const AlertButton = ({
  txtFront = "Hay actualizaciones",
  txtBack = "Actualizar",
  onClick,
}) => {
  return (
    <button className="alert-btn" onClick={onClick}>
      <span className="btn-text visible">
        <IoMdAlert />
        {txtFront}
      </span>
      <span className="btn-text hidden">
        <IoRefreshCircle />
        {txtBack}
      </span>
    </button>
  );
};

export default AlertButton;

import "./css/CardInfo.css";
import { GiAutoRepair } from "react-icons/gi";
import Swal from "sweetalert2";

const CardInfo = ({ title, route, backColor, state=true }) => {
  const handleClick = (e) => {
    if(!state) {
      e.preventDefault();
      Swal.fire({
        title: "Recurso no disponible",
        text: "Es posible que se encuentre en reparación y/o producción",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd"
      });
    }
  };

  return (
    <>
      <a href={state ? route : "#"} className="card-info-route" onClick={handleClick}>
        <div className="card-info" style={{ backgroundColor: backColor}}>
            <h1 className="card-info-title2">{title}</h1>
            {!state && <span className="card-info-alert">no disponible  <GiAutoRepair className="card-info-alert-logo" /></span>}
        </div>
      </a>
    </>
  );
};

export default CardInfo;

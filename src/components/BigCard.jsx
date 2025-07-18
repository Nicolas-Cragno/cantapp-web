import "./css/BigCard.css";
import { FaUser } from "react-icons/fa";
import { FaTruckFront } from "react-icons/fa6";
import { PiShippingContainerFill } from "react-icons/pi";

const BigCard = ({ title, value1, value2, value3, logo}) => {
  return (
    <>
        <div className="big-card container">
          <div className="row big">
            <div className="col-md-2">
              <img src={logo} alt="" className="card-logo"></img>
            </div>
            <div className="col-md">
              <div className="card-section">
                <h3 className="big-card-title">{title}</h3>
              </div>
              <div className="card-section">
                <p className="big-card-value">{value1} empleados <FaUser className="small-logo"/></p>
                <p className="big-card-value">{value2} tractores <FaTruckFront className="small-logo"/></p>
                <p className="big-card-value">{value3} furgones <PiShippingContainerFill className="small-logo"/></p>
              </div>
            </div>
          </div>
          <div className="row small-row small">
            <div className="col-md-2 small1">
              <img src={logo} alt="" className="card-logo-small"></img>
            </div>
            <div className="col-md small2">
              <div className="big-card-section">
                <p className="big-card-value"><FaUser className="small-logo"/>{value1}</p>
              </div>
              <div className="big-card-section">
                <p className="big-card-value"><FaTruckFront className="small-logo"/>{value2}</p>
              </div>
              <div className="big-card-section">
                <p className="big-card-value"><PiShippingContainerFill className="small-logo"/>{value2}</p>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default BigCard;

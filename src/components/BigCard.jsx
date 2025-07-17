import "./css/Card.css";
import { FaUser } from "react-icons/fa";
import { FaTruckFront } from "react-icons/fa6";
import { PiShippingContainerFill } from "react-icons/pi";

const BigCard = ({ title, value1, value2, value3, logo}) => {
  return (
    <>
        <div className="card container">
          <div className="row">
            <div className="col-md-2">
              <img src={logo} alt="" className="card-logo"></img>
            </div>
            <div className="col-md-10">
              <div className="card-section">
                <h3 className="card-title">{title}</h3>
              </div>
              <div className="card-section">
                <p className="big-card-value">{value1} empleados <FaUser className="small-logo"/></p>
                <p className="big-card-value">{value2} tractores <FaTruckFront className="small-logo"/></p>
                <p className="big-card-value">{value3} furgones <PiShippingContainerFill className="small-logo"/></p>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default BigCard;

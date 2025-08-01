import "./css/Card.css";
import { Link } from "react-router-dom";

const Card = ({ title, value, route }) => {
  return (
    <>
      <Link to={route} className="card-route">
        <div className="card">
          <div className="card-section">
            <h3 className="card-title">{title}</h3>
          </div>
          <div className="card-section">
            <p className="card-value big">{value} activos</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Card;

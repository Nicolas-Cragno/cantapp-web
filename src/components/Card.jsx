import "./css/Card.css";

const Card = ({ title, value, route }) => {
  return (
    <div className="card">
      <a href={route} className="card-route">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
      </a>
    </div>
  );
};

export default Card;

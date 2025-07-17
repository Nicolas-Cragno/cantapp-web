import "./css/Card.css";

const Card = ({ title, value, route }) => {
  return (
    <>
      <a href={route} className="card-route">
        <div className="card">
            <h3 className="card-title">{title}</h3>
            <p className="card-value big">{value} activos</p>
            <p className="card-value small">{value}</p>
        </div>
      </a>
    </>
  );
};

export default Card;

import "./css/Card.css";

const Card = ({ title, value, route }) => {
  return (
    <>
      <a href={route} className="card-route">
        <div className="card">
          <div className="card-section">
            <h3 className="card-title">{title}</h3>
          </div>
          <div className="card-section">
            <p className="card-value big">{value} activos</p>
          </div>
        </div>
      </a>
    </>
  );
};

export default Card;

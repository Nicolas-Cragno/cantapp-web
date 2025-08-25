import "./css/MiniCard.css";

const Card = ({ title, value }) => {
  return (
    <>
      <div className="mini-card">
        <div className="mini-card-section">
          <h3 className="mini-card-title">{title}</h3>
        </div>
        <div className="mini-card-section">
          <p className="mini-card-value big">{value}</p>
        </div>
      </div>
    </>
  );
};

export default Card;

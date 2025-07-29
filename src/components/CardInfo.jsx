import "./css/CardInfo.css";

const CardInfo = ({ title, route, backColor }) => {
  return (
    <>
      <a href={route} className="card-route">
        <div className="card-info" style={{ backgroundColor: backColor}}>
            <h1 className="card-info-title2">{title}</h1>
        </div>
      </a>
    </>
  );
};

export default CardInfo;

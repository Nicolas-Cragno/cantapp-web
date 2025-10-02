import "./css/Buttons.css";
import LogoDefault from "../../assets/logos/logo.svg";

const LogoButton = ({ logo = LogoDefault, onClick }) => {
  return (
    <button className="btn-body" onClick={onClick}>
      {typeof logo === "string" ? (
        <img src={logo} alt="" className="btn-logo" />
      ) : (
        <span className="btn-logo">{logo}</span>
      )}
    </button>
  );
};

export default LogoButton;

import LogoDefault from "../../assets/logos/logo.svg";
import "./css/Buttons.css";

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

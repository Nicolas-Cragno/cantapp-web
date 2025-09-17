import "./css/Buttons.css";
import LogoDefault from "../../assets/logos/logo.svg";

const LogoButton = ({ Logo = { LogoDefault }, onClick }) => {
  return (
    <button className="btn-body" onClick={onClick}>
      <img src={LogoDefault} alt="" className="tbn-logo" />
    </button>
  );
};

export default LogoButton;

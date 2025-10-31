import LogoDefault from "../../assets/logos/logo.svg";
import "./css/Buttons.css";

const TextButton = ({
  text = "",
  logo = LogoDefault,
  type = "button",
  onClick,
}) => {
  return (
    <button className="btn-body" type={type} onClick={onClick}>
      <img src={logo} alt="" className="btn-logo" /> {text}
    </button>
  );
};

export default TextButton;

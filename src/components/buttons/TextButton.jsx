import "./css/Buttons.css";

const TextButton = ({ text = "", type = "button", onClick }) => {
  return (
    <button className="btn-body" onClick={onClick} type={type}>
      {text}
    </button>
  );
};

export default TextButton;

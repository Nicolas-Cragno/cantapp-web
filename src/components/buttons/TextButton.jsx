import "./css/Buttons.css";

const TextButton = ({ text = "", type = "button", mini = false, onClick }) => {
  return (
    <button
      className={!mini ? "btn-body" : "btn-body-mini"}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default TextButton;

import "./css/Devs.css";

const BooleanValidator = ({ campo }) => {
  if (!Array.isArray(campo)) {
    return <span className="dev-item">No es un array</span>;
  }

  const cantidadTrue = campo.reduce(
    (acc, item) => (item === true ? acc + 1 : acc),
    0
  );

  return (
    <span className="dev-item">
      {typeof campo} | {cantidadTrue}/{campo.length}
    </span>
  );
};

export default BooleanValidator;

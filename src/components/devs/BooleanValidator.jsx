import "./css/Devs.css";
import { useData } from "../../context/DataContext";

const BooleanValidator = ({ campo }) => {
  const { usuario } = useData();
  if (!Array.isArray(campo)) {
    return <span className="dev-item">No es un array</span>;
  }

  const cantidadTrue = campo.reduce(
    (acc, item) => (item === true ? acc + 1 : acc),
    0
  );

  return usuario.rol === "dev" ? (
    <span className="dev-item">
      {typeof campo} | {cantidadTrue}/{campo.length}
    </span>
  ) : null;
};

export default BooleanValidator;

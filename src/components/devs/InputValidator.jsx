import "./css/Devs.css";

const InputValidator = ({ campo }) => {
  let valor;
  let tipo;

  if (campo === null) tipo = "null";
  else if (campo === undefined) tipo = "undefined";
  else if (Array.isArray(campo)) tipo = "array";
  else if (campo instanceof Date) tipo = "date";
  else tipo = typeof campo;

  switch (tipo) {
    case "null":
      valor = "null";
      break;

    case "undefined":
      valor = "undefined";
      break;

    case "array": {
      const cantidad = campo.length;
      if (cantidad === 0) {
        valor = "[0]";
      } else {
        valor = `[${cantidad}]`;
      }
      break;
    }

    case "date":
      valor = campo.toISOString();
      break;

    case "object": {
      const texto = JSON.stringify(campo);
      valor = texto.length > 30 ? texto.slice(0, 30) + "..." : texto;
      break;
    }

    default: {
      const valorAux = String(campo);
      valor = valorAux.length > 30 ? valorAux.slice(0, 30) + "..." : valorAux;
      break;
    }
  }

  return (
    <span className="dev-item">
      {tipo} | {valor}
    </span>
  );
};

export default InputValidator;

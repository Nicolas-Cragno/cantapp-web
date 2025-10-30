// ----------------------------------------------------------------------- imports externos
import { useState } from "react";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import FormEmpresa from "../forms/FormEmpresa";
import "./css/Fichas.css";
import FormProveedor from "../forms/FormProveedor";

const FichaProveedor = ({ elemento, onClose, onGuardar }) => {
  const { proveedores } = useData();
  const [modoEdicion, setModoEdicion] = useState(false);
  if (!elemento) return null;

  const handleGuardado = async (proveedorModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(proveedorModificado);
  };
  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}>
              {" "}
              ✕{" "}
            </button>
            <h1 className="articulo-name">
              <strong className="articulo-codigo">{elemento.nombre}</strong>
            </h1>
            <hr />
            <div className="ficha-info">
              <p>
                <strong>Codigo </strong>
                <br />
                {elemento.codigo || elemento.id}
              </p>
              <p>
                <strong>Cuit </strong>
                <br />
                {elemento.cuit}
              </p>
              <p>
                <strong>Marca </strong>
                <br />
                {elemento.marca}
              </p>
            </div>
            {elemento.detalle && (
              <>
                <p className="ficha-info-title">
                  <strong>Detalle</strong>
                </p>
                <div className="ficha-info">
                  <p>{elemento.detalle}</p>
                </div>
              </>
            )}
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormProveedor
          elemento={elemento}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaProveedor;

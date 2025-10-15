import "./css/Fichas.css";
import { useState, useEffect } from "react";
import FormStock from "../forms/FormStock";

const FichaStock = ({ articulo, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  if (!articulo) return null;

  const handleGuardado = async (articuloModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(articuloModificado);
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
              <strong className="articulo-codigo">{articulo.id}</strong>
            </h1>
            <hr />
            <div className="ficha-info">
              <p>
                <strong>Tipo </strong>
                <br />
                {articulo.tipo}
              </p>
              <p>
                <strong>Descripcion </strong>
                <br />
                {articulo.descripcion}
              </p>
              <p>
                <strong>Marca </strong>
                <br />
                {articulo.marca ? articulo.marca : "GENERICO"}
              </p>
              {articulo.codigoProveedor ? (
                <p>
                  <strong>Proveedor</strong>
                  <br />
                  {articulo.proveedor}
                </p>
              ) : null}
              {articulo.codigoProveedor ? (
                <p>
                  <strong>Codigo Proveedor</strong>
                  <br />
                  {articulo.codigoProveedor}
                </p>
              ) : null}
            </div>
            <div className="ficha-info">
              <p>
                <strong>Disponible: </strong>
                {articulo.cantidad === 0
                  ? "SIN STOCK"
                  : articulo.cantidad + " " + articulo.unidad}
              </p>
            </div>
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormStock
          articulo={articulo}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaStock;

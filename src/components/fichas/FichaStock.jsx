import "../css/Fichas.css";
import { useState, useEffect } from "react";
import FormularioStock from "../forms/FormularioStock";

const FichaStock = ({ articulo, onClose, onGuardar }) => {
    const [modoEdicion, setModoEdicion] = useState(false);
    if (!articulo) return null;

    const handleGuardado = async (articuloModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(articuloModificado);
  };
    return(
        <>
        {!modoEdicion ? (
            <div className="ficha">
                <div className="ficha-content">
                    <button className="ficha-close" onClick={onClose}> ✕ </button>
                    <h1 className="articulo-name">
                        <strong className="articulo-codigo">{articulo.id}</strong>
                    </h1>
                    <hr />
                    <div className="ficha-info">
                        <p><strong>Descripcion: </strong>{articulo.descripcion}</p>
                        <p><strong>Marca: </strong>{articulo.marca}</p>
                        <p><strong>Codigo: </strong>{articulo.codigoProveedor}</p>
                    </div>
                    <div className="ficha-info">
                        <p><strong>Disponible: </strong>{articulo.cantidad} {articulo.unidad}</p>
                    </div>
                    <div className="ficha-buttons">
                        <button onClick={() => setModoEdicion(true)}>Editar</button>
                    </div>
                </div>
            </div>
        ): (
            <FormularioStock
            articulo={articulo}
            onClose={() => setModoEdicion(false)}
            onGuardar={handleGuardado}
            />
        )}
        
        </>
    )
}

export default FichaStock;
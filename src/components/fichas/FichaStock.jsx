import "../css/Fichas.css";
import { useState, useEffect } from "react";
import FormularioStock from "../forms/FormularioStock";

const FichaStock = ({ articulo, onClose, onGuardar }) => {
    const [modoEdicion, setModoEdicion] = useState(false);

    const handleGuardado = async (articuloModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(articuloModificado);
  };
    return(
        <>
        {!modoEdicion ? (
            <div className="ficha"></div>
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
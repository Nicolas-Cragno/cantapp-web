// ----------------------------------------------------------------------- imports externos
import { useState } from "react";

// ----------------------------------------------------------------------- estilos
import "./css/Modales.css";

const ModalSatelital = ({
  litros,
  setLitros,
  distancia,
  setDistancia,
  onClose,
}) => {
  const [litrosInput, setLitrosInput] = useState(litros || "");
  const [distanciaInput, setDistanciaInput] = useState(distancia || "");

  const handleGuardar = () => {
    setLitros(parseFloat(litrosInput) || 0);
    setDistancia(parseFloat(distanciaInput) || 0);
    onClose();
  };

  return (
    <div className="modal">
      <button className="modal-close" onClick={onClose}>
        ✕
      </button>

      <div className="modal-header">
        <h2>Satelital</h2>
        <hr />
      </div>

      <div className="form-content">
        <label>Litros:</label>
        <input
          type="number"
          step="0.01"
          value={litrosInput}
          onChange={(e) => setLitrosInput(e.target.value)}
        />

        <label>Distancia (km):</label>
        <input
          type="number"
          step="0.01"
          value={distanciaInput}
          onChange={(e) => setDistanciaInput(e.target.value)}
        />

        <button className="btn-guardar" onClick={handleGuardar}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ModalSatelital;

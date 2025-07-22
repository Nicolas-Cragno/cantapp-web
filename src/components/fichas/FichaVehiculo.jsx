import "../css/Fichas.css";
import { nombreEmpresa } from "../../functions/data-functions"; 
import { useState } from "react";
import FormularioVehiculo from "../forms/FormularioVehiculo";

const FichaVehiculo = ({ vehiculo, tipoVehiculo, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  if (!vehiculo) return null;

  const empresa = nombreEmpresa(vehiculo.empresa);

  const handleGuardado = async (vehiculoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(vehiculoModificado);
  };

  const minimizarTipo = (tipoMax) => {
    let auxTipo;  
    switch(tipoMax){
        case "utilitarios":
          auxTipo = "UTILITARIO"
          break;
        case "tractores":
          auxTipo = "TRACTOR"
          break;
        case "furgones":
          auxTipo = "FURGON"
          break;
        default:
          auxTipo = "SIN ASIGNAR"
          break;
    }
    
    return auxTipo;
  }

  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}> ✕ </button>
            <h1 className="vehiculo-name">
              <strong className="dominio">{vehiculo.dominio}</strong>
              <span className="interno"> {vehiculo.interno} </span>
            </h1>
            <hr />
            <p className="puesto"><strong>{minimizarTipo(tipoVehiculo)}</strong></p>
            <div className="ficha-info">
              <p><strong>Marca: </strong>{vehiculo.marca || ""}</p>
              <p><strong>Modelo: </strong>{vehiculo.modelo || ""}</p>
              <p><strong>Empresa: </strong>{empresa}</p>
              <p><strong>Detalle: </strong>{vehiculo.detalle || ""}</p>
            </div>
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormularioVehiculo
          tipoVehiculo={tipoVehiculo}
          vehiculo={vehiculo}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaVehiculo;

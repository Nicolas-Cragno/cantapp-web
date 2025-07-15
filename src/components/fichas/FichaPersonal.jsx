import "../css/Fichas.css";
import { nombreEmpresa } from "../../functions/empresaUtils";

const FichaPersonal = ({ persona, onClose}) => {
    if (!persona) return null;

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>✕</button>
                <h1 className="person-name">
                    <strong className="apellido">{persona.apellido}</strong>
                    <span className="nombres">{persona.nombres}</span>
                </h1>
                <hr/>
                <p className="detalle"><strong>{persona.detalle}</strong></p>

                <p><strong>DNI:</strong> {persona.dni || "No especificado"}</p>

            </div>
        </div>
    )
}

export default FichaPersonal;
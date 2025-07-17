import "../css/Fichas.css";
import { nombreEmpresa, formatearFecha } from "../../functions/data-functions";

const FichaPersonal = ({ persona, onClose}) => {
    if (!persona) return null;

    const empresa = nombreEmpresa(persona.empresa);
    const fechaIngreso = formatearFecha(persona.ingreso);

    return(
        <div className="ficha">
            <div className="ficha-content">
                <button className="ficha-close" onClick={onClose}>✕</button>
                <h1 className="person-name">
                    <strong className="apellido">{persona.apellido}</strong>
                    <span className="nombres">{persona.nombres}</span>
                </h1>
                <hr/>
                <p className="puesto"><strong>{persona.puesto}</strong></p>
                <p><strong>DNI: </strong> {persona.dni || "No especificado"}</p>
                <p><strong>Empresa: </strong> {empresa}</p>
                <p><strong>Ingreso: </strong> {fechaIngreso || ""}</p>
                <p><strong>Detalle: </strong> {persona.detalle || ""}</p>
            </div>
        </div>
    )
}

export default FichaPersonal;
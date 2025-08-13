import "../css/Fichas.css";
import { useEffect, useState } from "react";
import { nombreEmpresa, formatearFecha } from "../../functions/data-functions";
import { buscarPersona, buscarUsuario } from "../../functions/db-functions";
import LogoEmpresa from "../LogoEmpresa";
import ImgDefault from "../../assets/logos/noimage.png";

const FichaPerfil = ({ persona, onClose }) => {
  const [personaDB, setPersonaDB] = useState(null);
  const [personaUser, setPersonaUser] = useState(null);
  const [rolUser, setRolUser] = useState(null);
  const [funcionUser, setFuncionUser] = useState(null);

  useEffect(() => {
    const buscarPersonaDB = async () => {
      const resultado = await buscarPersona(persona.dni);
      setPersonaDB(resultado);
    };
    const buscarPersonaUser = async () => {
      const resultado = await buscarUsuario(persona.dni);
      setPersonaUser(resultado);
    };

    buscarPersonaDB();
    buscarPersonaUser();
  }, [persona.dni]);

  useEffect(() => {
    if (!personaUser) return;
    const dataUser = async () => {
      switch (personaUser.rol) {
        case "dev":
          setRolUser("Desarrollador");
          setFuncionUser("Acceso total");
          break;
        case "admin":
          setRolUser("Administrador");
          setFuncionUser("Gestión y edición de recursos/eventos");
          break;
        default: // user
          setRolUser("Usuario");
          setFuncionUser("Gestión y edición eventos");
          break;
      }
    };
    dataUser();
  }, [personaUser]);

  if (!persona || !personaDB) return null;

  const fechaIngreso = formatearFecha(personaDB.ingreso);

  return (
    <div className="ficha perfil-ficha">
      <div className="ficha-content">
        <button className="ficha-close" onClick={onClose}>
          ✕
        </button>
        <div className="perfil-header">
          <h1 className="perfil-apellido">{persona.apellido}</h1>
          <h3 className="perfil-nombre">{persona.nombres}</h3>
          <hr />
        </div>
        <p className="ficha-info-title">
          <strong>Información del usuario</strong>
        </p>
        <div className="ficha-info container">
          <p className="ficha-info-item">
            <strong>Mail</strong>{" "}
            <span className="ficha-info-item-txt">{personaUser.mail}</span>
          </p>
          <p className="ficha-info-item">
            <strong>Rol</strong>{" "}
            <span className="ficha-info-item-txt">{rolUser}</span>
          </p>
          <p className="ficha-info-item">
            <strong>Funcion</strong>{" "}
            <span className="ficha-info-item-txt">{funcionUser}</span>
          </p>
        </div>
        {personaDB ? (
          <>
            <div className="ficha-info container">
              <div className="row">
                <div className="col-md-9">
                  <p className="ficha-info-item">
                    <strong>Empresa</strong>{" "}
                    <span className="ficha-info-item-txt">
                      {nombreEmpresa(personaDB.empresa)}
                    </span>
                  </p>
                  <p className="ficha-info-item">
                    <strong>Ingreso</strong>{" "}
                    <span className="ficha-info-item-txt">
                      {fechaIngreso || ""}
                    </span>
                  </p>
                  <p className="ficha-info-item">
                    <strong>Puesto</strong>{" "}
                    <span className="ficha-info-item-txt">
                      {personaDB.puesto}
                    </span>
                  </p>
                </div>
                <div className="col-md-3 col-img">
                  <LogoEmpresa cuitEmpresa={persona.empresa} />
                </div>
              </div>
            </div>
            <p className="ficha-info-title">
              <strong>Detalle</strong>
            </p>
            <div className="ficha-info">
              <p>{persona.detalle || ""}</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FichaPerfil;

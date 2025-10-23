// ----------------------------------------------------------------------- imports externos
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  buscarEmpresa,
  formatearFecha,
  buscarPersona,
} from "../../functions/dataFunctions";
import LogoEmpresa from "../logos/LogoEmpresa";
import "./css/Fichas.css";

const FichaPerfil = ({ persona, onClose, OnGuardar = false }) => {
  const { users, personas, empresas } = useData();
  const [personaDB, setPersonaDB] = useState(null);
  const [personaUser, setPersonaUser] = useState(null);
  const [rolUser, setRolUser] = useState("");
  const [funcionUser, setFuncionUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!persona || !persona.dni) return;

    const cargarDatos = async () => {
      setLoading(true);
      try {
        const dbData = await buscarPersona(personas, persona.dni);
        const userData = await buscarPersona(users, persona.dni);

        setPersonaDB(dbData || {});
        setPersonaUser(userData || {});

        // Determinar rol y función
        switch (userData?.rol) {
          case "dev":
            setRolUser("Desarrollador");
            setFuncionUser("Acceso total");
            break;
          case "admin":
            setRolUser("Administrador");
            setFuncionUser("Gestión y edición de recursos/eventos");
            break;
          default:
            setRolUser("Usuario");
            setFuncionUser("Gestión y edición eventos");
            break;
        }
      } catch (error) {
        console.error("Error cargando datos de persona:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [persona]);

  if (!persona) return null;

  if (loading) {
    return (
      <div className="ficha perfil-ficha">
        <div className="ficha-content">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const fechaIngreso = personaDB?.ingreso
    ? formatearFecha(personaDB.ingreso)
    : "";

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
            <span className="ficha-info-item-txt">
              {personaUser?.mail || ""}
            </span>
          </p>
          <p className="ficha-info-item">
            <strong>Rol</strong>{" "}
            <span className="ficha-info-item-txt">{rolUser}</span>
          </p>
          <p className="ficha-info-item">
            <strong>Función</strong>{" "}
            <span className="ficha-info-item-txt">{funcionUser}</span>
          </p>
        </div>

        <p className="ficha-info-title">
          <strong>Información laboral</strong>
        </p>
        <div className="ficha-info container">
          <div className="row">
            <div className="col-md-9">
              <p className="ficha-info-item">
                <strong>Empresa</strong>{" "}
                <span className="ficha-info-item-txt">
                  {personaDB?.empresa
                    ? buscarEmpresa(empresas, personaDB.empresa)
                    : ""}
                </span>
              </p>
              <p className="ficha-info-item">
                <strong>Ingreso</strong>{" "}
                <span className="ficha-info-item-txt">{fechaIngreso}</span>
              </p>
              <p className="ficha-info-item">
                <strong>Puesto</strong>{" "}
                <span className="ficha-info-item-txt">
                  {personaDB?.puesto || ""}
                </span>
              </p>
            </div>
            <div className="col-md-3 col-img">
              {personaDB?.empresa && (
                <LogoEmpresa cuitEmpresa={personaDB.empresa} />
              )}
            </div>
          </div>
        </div>

        {personaDB?.detalle && (
          <>
            <p className="ficha-info-title">
              <strong>Detalle</strong>
            </p>
            <div className="ficha-info">
              <p>{personaDB.detalle}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FichaPerfil;

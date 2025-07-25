import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Alert.css";

const NoAutorizado = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="no-autorizado-container">
      <h1 className="no-autorizado-titulo">Acceso Denegado</h1>
      <p className="no-autorizado-texto">No tenés autorización para acceder a esta página.</p>
      <button className="no-autorizado-boton" onClick={() => navigate("/")}>
        Volver al inicio
      </button>
    </div>
  );
};

export default NoAutorizado;

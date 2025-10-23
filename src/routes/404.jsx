import { useNavigate } from "react-router-dom";
import "../assets/css/Alert.css";

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div className="pagina404-container">
      <h1 className="pagina404-titulo">404</h1>
      <p className="pagina404-subtitulo">Página no encontrada</p>
      <p className="pagina404-texto">La página que estás buscando no existe.</p>
      <button className="pagina404-boton" onClick={() => navigate("/")}>
        Volver al inicio
      </button>
    </div>
  );
};

export default Page404;

import { useData } from "../../context/DataContext";
import { buscarEmpresa } from "../../functions/dataFunctions";
import LogoTC from "../../assets/images/logo-tc-color.png";
import LogoEX from "../../assets/images/logo-ex-color.png";
import LogoTA from "../../assets/images/logo-ta-color.png";
import LogoDefault from "../../assets/images/logo-truck.png";
import "./css/Logos.css";

const LogoEmpresa = ({ cuitEmpresa, mini = false }) => {
  const { empresas } = useData();
  const logos = {
    30610890403: LogoTC,
    30644511304: LogoEX,
    30683612916: LogoTA,
  };

  const logo = logos[String(cuitEmpresa)] || LogoDefault;
  const nombre = buscarEmpresa(empresas, cuitEmpresa);

  return (
    <div className="logo-empresa">
      <img
        src={logo}
        alt={nombre}
        className={mini ? "logo-img-only-mini" : "logo-img-only"}
      ></img>
    </div>
  );
};

export default LogoEmpresa;

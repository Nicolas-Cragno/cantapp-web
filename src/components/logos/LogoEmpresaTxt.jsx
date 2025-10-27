import { useData } from "../../context/DataContext";
import { buscarEmpresa } from "../../functions/dataFunctions";
import LogoTC from "../../assets/images/logo-tc-color.png";
import LogoEX from "../../assets/images/logo-ex-color.png";
import LogoTA from "../../assets/images/logo-ta-color.png";
import LogoDefault from "../../assets/images/logo-truck.png";
import "./css/Logos.css";

const LogoEmpresaTxt = ({ cuitEmpresa, completo = true }) => {
  const { empresas } = useData();

  if (!empresas?.length) return null;

  const logos = {
    30610890403: LogoTC,
    30644511304: LogoEX,
    30683612916: LogoTA,
  };

  const empresasFiltro = empresas.filter(
    (e) => e?.tipo?.toLowerCase() === "propia"
  );

  const logo = logos[cuitEmpresa] || LogoDefault;
  const nombre = buscarEmpresa(empresasFiltro, cuitEmpresa);
  const nombreAbreviado = buscarEmpresa(empresasFiltro, cuitEmpresa, false);

  return (
    <div className="logo-empresa-txt">
      <img src={logo} alt={nombre} className="logo-img-small" />
      <span className="logo-name">{completo ? nombre : nombreAbreviado}</span>
    </div>
  );
};

export default LogoEmpresaTxt;

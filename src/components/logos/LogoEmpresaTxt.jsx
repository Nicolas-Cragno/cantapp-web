import LogoTC from "../../assets/images/logo-tc-color.png";
import LogoEX from "../../assets/images/logo-ex-color.png";
import LogoTA from "../../assets/images/logo-ta-color.png";
import LogoDefault from "../../assets/images/logo-truck.png";
import "./css/Logos.css";

const LogoEmpresaTxt = ({ cuitEmpresa, completo = true }) => {
  const logos = {
    30610890403: LogoTC,
    30644511304: LogoEX,
    30683612916: LogoTA,
  };

  const nombres = {
    30610890403: "TRANSPORTES CANTARINI",
    30644511304: "EXPRESO CANTARINI",
    30683612916: "TRANSAMERICA TRANSPORTES",
  };

  const nombresAbreviados = {
    30610890403: "TC",
    30644511304: "EX",
    30683612916: "TA",
  };

  const logo = logos[cuitEmpresa] || LogoDefault;
  const nombre = nombres[cuitEmpresa] || "SIN ASIGNAR";
  const nombreAbreviado = nombresAbreviados[cuitEmpresa] || "S/A";

  return (
    <div className="logo-empresa-txt">
      <img src={logo} alt={nombre} className="logo-img-small"></img>
      <spam className="logo-name">{completo ? nombre : nombreAbreviado}</spam>
    </div>
  );
};

export default LogoEmpresaTxt;

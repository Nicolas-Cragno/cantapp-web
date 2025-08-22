import LogoTC from "../../assets/images/logo-tc-color.png";
import LogoEX from "../../assets/images/logo-ex-color.png";
import LogoTA from "../../assets/images/logo-ta-color.png";
import LogoDefault from "../../assets/images/logo-truck.png";
import { nombreEmpresa } from "../../functions/data-functions";
import "./css/Logos.css";

const LogoEmpresa = ({ cuitEmpresa }) => {
  const logos = {
    30610890403: LogoTC,
    30644511304: LogoEX,
    30683612916: LogoTA,
  };

  const logo = logos[String(cuitEmpresa)] || LogoDefault;
  const nombre = nombreEmpresa(cuitEmpresa);

  return (
    <div className="logo-empresa">
      <img src={logo} alt={nombre} className="logo-img-only"></img>
    </div>
  );
};

export default LogoEmpresa;

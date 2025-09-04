import LogoProsegur from "../../assets/logos/logoProsegur.png";
import LogoDefault from "../../assets/images/logo-truck.png";
import { nombreProveedor } from "../../functions/data-functions";
import "./css/Logos.css";

const LogoEmpresaTxt = ({ cuitEmpresa }) => {
  const logos = {
    30575170125: LogoProsegur,
  };

  const logo = logos[String(cuitEmpresa)] || LogoDefault;
  const nombre = nombreProveedor(cuitEmpresa);

  return (
    <div className="logo-empresa-txt">
      <img src={logo} alt={nombre} className="logo-img-small"></img>
      <spam className="logo-name">{nombre}</spam>
    </div>
  );
};

export default LogoEmpresaTxt;

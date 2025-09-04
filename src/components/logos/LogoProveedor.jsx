import LogoProsegur from "../../assets/logos/logoProsegur.png";
import LogoDefault from "../../assets/images/logo-truck.png";
import { nombreProveedor } from "../../functions/data-functions";
import "./css/Logos.css";

const LogoProveedor = ({ cuitEmpresa }) => {
  const logos = {
    30575170125: LogoProsegur,
  };

  const logo = logos[String(cuitEmpresa)] || LogoProsegur;
  const nombre = nombreProveedor(cuitEmpresa);

  return (
    <div className="logo-empresa">
      <img src={logo} alt={nombre} className="logo-img-only"></img>
    </div>
  );
};

export default LogoProveedor;

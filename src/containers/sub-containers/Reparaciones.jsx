import TablaEventosTaller from "../../components/tablas/TablaEventosTaller";
import LogoFurgon from "../../assets/logos/logofurgon.png";
import LogoTractor from "../../assets/logos/logotractor.png";
import LogoDefault from "../../assets/logos/logoutilitario.png";

const Reparaciones = ({ subArea }) => {
  let logoTaller;
  switch (subArea) {
    case "tractores":
      logoTaller = LogoTractor;
      break;
    case "furgones":
      logoTaller = LogoFurgon;
      break;
    default:
      logoTaller = LogoDefault;
      break;
  }

  return (
    <section className="reparaciones">
      <TablaEventosTaller
        tipo="reparacion"
        area="taller"
        subarea={subArea}
        tipoPorArea="TALLER"
        logo={logoTaller}
      ></TablaEventosTaller>
    </section>
  );
};

export default Reparaciones;

import TablaEventos from "../../components/tablas/TablaEventos";
import LogoSatelital from "../../assets/logos/logosatelital.png";

const RegistroSatelital = () => {
  return (
    <div className="registro-satelital">
      <TablaEventos
        tipo={null}
        area="trafico"
        tipoPorArea="SATELITAL"
        title="SATELITAL"
        logo={LogoSatelital}
      ></TablaEventos>
    </div>
  );
};

export default RegistroSatelital;

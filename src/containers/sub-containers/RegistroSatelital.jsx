import TablaEventos from "../../components/tablas/TablaEventos";

const RegistroSatelital = () => {
  return (
    <div className="registro-satelital">
      <TablaEventos
        tipo={null}
        area="trafico"
        tipoPorArea="SATELITAL"
      ></TablaEventos>
    </div>
  );
};

export default RegistroSatelital;

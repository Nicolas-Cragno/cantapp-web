import TablaEventosPorteria from "../../components/tablas/TablaEventosPorteria";
import LogoPorteria from "../../assets/logos/logoporteria.png";

const Movimientos = () => {
  return (
    <section className="movimientos">
      <TablaEventosPorteria
        tipo="movimiento"
        area="porteria"
        tipoPorArea="PORTERIA"
        logo={LogoPorteria}
        title="PORTERIA"
      ></TablaEventosPorteria>
    </section>
  );
};

export default Movimientos;

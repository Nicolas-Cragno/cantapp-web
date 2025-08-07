import TablaEventosPorteria from "../../components/tablas/TablaEventosPorteria";

const Movimientos = () => {
  return (
    <section className="movimientos">
      <TablaEventosPorteria
        tipo="movimiento"
        area="porteria"
        tipoPorArea="PORTERIA"
      ></TablaEventosPorteria>
    </section>
  );
};

export default Movimientos;

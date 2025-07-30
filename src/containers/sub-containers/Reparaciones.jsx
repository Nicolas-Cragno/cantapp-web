import TablaEventosTaller from "../../components/tablas/TablaEventosTaller";

const Reparaciones = ({subArea}) => {
    return(
        <section className="reparaciones">
            <TablaEventosTaller tipo="reparacion" area="taller" subarea={subArea} tipoPorArea="TALLER"></TablaEventosTaller>
        </section>
    )
}

export default Reparaciones;
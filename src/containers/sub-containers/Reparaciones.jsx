import TablaEventos from "../../components/tablas/TablaEventos";

const Reparaciones = () => {
    return(
        <section className="reparaciones">
            <TablaEventos tipo="reparacion" area="taller tractores" tipoPorArea="TALLER"></TablaEventos>
        </section>
    )
}

export default Reparaciones;
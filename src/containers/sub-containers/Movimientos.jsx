import TablaEventos from "../../components/tablas/TablaEventos";

const Movimientos = () => {
    return(
        <section className="movimientos">
            <TablaEventos tipo="movimiento" area="porteria" tipoPorArea="MOVIMIENTOS"></TablaEventos>
        </section>
    )
}

export default Movimientos;
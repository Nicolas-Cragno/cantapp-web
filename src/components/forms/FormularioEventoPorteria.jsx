import { useState, useEffect } from "react";
import "../css/Forms.css";
import { agregar, buscarNombrePorDni, modificar } from "../../functions/db-functions.js";
// importar para conseguir dni a partir de nombre - crear funcion

const FormularioEventoPorteria = ({evento, onClose, onGuardar}) => {
    // const [area, setArea] = useState(""); // por defecto PORTERIA
    const [furgon, setFurgon] = useState(0);
    const [tractor, setTractor] = useState(0);
    const [persona, setPersona] = useState("");
    const [fecha, setFecha] = useState("");
    const [detalle, setDetalle] = useState("");
    const [tipo, setTipo] = useState("");
    const [subtipo, setSubtipo] = useState("");
    const [antibandalico, setAntibandalico] = useState(false);
    const [cabina, setCabina] = useState(false);
    const [corte, setCorte] = useState(false);
    const [desenganche, setDesenganche] = useState(false);
    const [llave, setLlave] = useState(false);
    const [panico, setPanico] = useState(false);
    const [puertaFurgon, setPuertaFurgon] = useState(false);
    const [reporte, setReporte] = useState(false);
    const [loading, setLoading] = useState(false);

    const modoEdicion = !!evento;

    useEffect(() => {
        if(modoEdicion && evento){
            setFurgon(evento.furgon);
            setTractor(evento.tractor);
            setPersona(buscarNombrePorDni(evento.persona));
            setFecha(evento.fecha);
            setDetalle(evento.detalle);
            setTipo(evento.tipo);
            setSubtipo(evento.subtipo);
            setAntibandalico(evento.antibandalico);
            setCabina(evento.cabina);
            setCorte(evento.corte);
            setDesenganche(evento.desenganche);
            setLlave(evento.llave);
            setPanico(evento.panico);
            setPuertaFurgon(evento.puertafurgon);
            setReporte(evento.reporte);
        }
    }, [modoEdicion, evento]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!String(tipo).trim() || !String(subtipo).trim()){
            alert("Complete los datos obligatorios.");
            return;
        }

        setLoading(true);

        try{
            if(modoEdicion) {
                const eventoEditado = {
                    furgon: String(furgon),
                    tractor: String(tractor),
                    persona: persona.toUpperCase(),
                    //fecha: ,
                    detalle: detalle.toUpperCase(),
                    tipo: tipo.toUpperCase(),
                    subtipo: subtipo.toUpperCase(),
                    //antibandalico: ,
                    //cabina: ,
                    //corte: ,
                    //desenganche: ,
                    //llave: ,
                    //panico: ,
                    //puertaFurgon: ,
                    //reporte:
                };

                await modificar("eventos", evento.id, eventoEditado);

                if (onGuardar) onGuardar(eventoEditado);
            } else {
                const nuevoEvento = {
                    // datos para agregar
                };

                const eventoAgregado = await agregar("eventos", nuevoEvento); // ver id automatico
                if(onGuardar) onGuardar(eventoAgregado);
            }
            
            onClose();
        } catch(error) {
            alert("Ocurrió un error al guardar el evento.");
            console.error("Error al guardar evento: ", error);
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="form">
            <div className="form-content">
                <h2>{modoEdicion ? "MODIFICAR" : "NUEVO"} EVENTO</h2>
            </div>
        </div>
    )
};

export default FormularioEventoPorteria;

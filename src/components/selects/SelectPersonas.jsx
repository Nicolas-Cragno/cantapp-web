import { useEffect, useState } from "react";
import { listarColeccion } from "../../functions/db-functions";

const SelectPersonas = ({ value, onChange, puesto=null, name="persona"}) => {
    const [personas, setPersonas] = useState([]);

    useEffect(()=> {
        const cargarPersonas = async () => {
            const data = await listarColeccion("personas");
            let dataFinal = data;

            if(puesto){
                dataFinal = data.filter(p => p.puesto === puesto.toUpperCase());
            } 
            dataFinal.sort((a, b) => a.apellido.localeCompare(b.apellido));

            setPersonas(dataFinal) // Todas las personas
        };
        cargarPersonas();
    }, []);

    return(
        <select name={name} value={value} onChange={onChange}>
            <option value={""}></option>
            {personas.map((p) => (
                <option key={p.dni} value={p.dni}>
                    {p.apellido} {p.nombres} ({p.dni})
                </option> 
            ))}
        </select>
    )
}

export default SelectPersonas;
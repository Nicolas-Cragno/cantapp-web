import { useEffect, useState } from "react";
import { listarColeccion } from "../../functions/db-functions";

const SelectVehiculos = ({ value, onChange, tipoVehiculo="tractores", name="vehiculo"}) => {
    const [vehiculos, setVehiculos] = useState([]);

    useEffect(()=>{
        const cargarVehiculos = async () => {
            const data = await listarColeccion(tipoVehiculo.toLocaleLowerCase());

            data.sort((a, b) => a.interno.toString().localeCompare(b.interno.toString()));

            setVehiculos(data);
        };
        cargarVehiculos();
    }, [tipoVehiculo]);

    return(
        <select name={name} value={value} onChange={onChange}>
            <option value=""></option>
            {vehiculos.map((v) => (
                <option key={v.interno} value={v.interno}>
                    {v.interno} ({v.dominio})
                </option>
            ))}
        </select>
    )
};

export default SelectVehiculos;
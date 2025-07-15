import { useState, useEffect, use } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FaSpinner } from "react-icons/fa";
import { db } from "../../firebase/firebaseConfig";
import "../css/Tables.css";

const TablaVehiculo = (props) => {
    const {tipoVehiculo} = props;
    const [vehiculos, setVehiculos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);
    const title = tipoVehiculo.toUpperCase();

    useEffect(() => {
        const obtenerDatos = async () => {
            setLoading(true);
            try{
                const querySnapshot = await getDocs(collection(db, tipoVehiculo));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const listadoVehiculos = data.filter(v => v.estado === 1 || v.estado === true);

                setVehiculos(listadoVehiculos);
            } catch (error){
                console.error("Error al obtener información desde db: ", error);
            }
            finally {
                setLoading(false);
            }
        };

        obtenerDatos();
    }, []);

    // Filtro
    const vehiculosFiltrados = vehiculos.filter((v) => {
        const nombreCompleto = `${v.dominio || ""} ${v.interno || ""} ${v.detalle || ""}`;
        return nombreCompleto.toLowerCase().includes(filtro.toLocaleLowerCase());
    });

    return(
        <section className="table-container">
            <div className="table-header">
                <h1 className="table-title">{title}</h1>
                <input 
                type="text"
                placeholder="Buscar..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="table-busqueda"
                />
            </div>

            <ul className="table-lista">
                {loading ? (
                    <li className="loading-item"><FaSpinner className='spinner'/></li>
                ) : vehiculosFiltrados.length > 0 ? (
                    vehiculosFiltrados.map((vehiculo) => (
                        <li key={vehiculo.id} className="table-item">
                            <span className="table-nombre">{vehiculo.interno} - {vehiculo.dominio}</span>
                            <span className="table-info">{vehiculo.detalle}</span>
                        </li>
                    ))
                ) : (
                    <li className="loading-item">No se encontraron {tipoVehiculo.toLowerCase}s</li>
                )}
            </ul>

            <div className="table-options">
                <button className="table-agregar">+ AGREGAR</button>
            </div>
        </section>
    )
}

export default TablaVehiculo;
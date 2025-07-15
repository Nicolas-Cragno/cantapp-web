import { useState, useEffect, use } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FaSpinner } from "react-icons/fa";
import { db } from "../../firebase/firebaseConfig";
import "../css/Tables.css";

const TablaMovimiento = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);
    const title = "MOVIMIENTOS";
    let fechaTxt = "";

    useEffect(() => {
        const obtenerDatos = async () => {
            setLoading(true);
            try{
                const querySnapshot = await getDocs(collection(db, "eventos"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const listadoEventos = data.filter(e => e.tipo === "MOVIMIENTO");

                setMovimientos(listadoEventos);
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
    const eventosFiltrados = movimientos.filter((m) => {

        if(m.fecha instanceof Object && typeof m.fecha.toDate === "function"){
            fechaTxt = m.fecha.toDate().toLocaleDateString("es-AR");
        } else if (typeof m.fecha =="string"){
            fechaTxt = m.fecha;
        }

        const txtFiltro = `${m.subtipo || ""} ${m.persona || ""} ${m.tractor || ""} ${m.furgon || ""} ${fechaTxt}`;
        return txtFiltro.toLowerCase().includes(filtro.toLocaleLowerCase());
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
                ) : eventosFiltrados.length > 0 ? (
                    eventosFiltrados.map((movimiento) => (
                        <li key={movimiento.id} className="table-item">
                            <span className="table-nombre">{movimiento.subtipo}</span>
                            <span className="table-info">{movimiento.persona}</span>
                            <span className="table-info">Tractor: {movimiento.tractor}</span>
                            <span className="table-info">Furgon: {movimiento.furgon}</span>
                            <span className="table-info">{fechaTxt}</span>
                        </li>
                    ))
                ) : (
                    <li className="table-item">No se encontraron eventos</li>
                )}
            </ul>

            <div className="table-options">
                <button className="table-agregar">+ AGREGAR</button>
            </div>
        </section>
    )
}

export default TablaMovimiento;
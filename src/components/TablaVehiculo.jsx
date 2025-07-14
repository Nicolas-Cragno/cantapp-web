import { useState, useEffect, use } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "./css/TablaVehiculo.css";

const TablaVehiculo = (props) => {
    const {tipoVehiculo} = props;
    const [vehiculos, setVehiculos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);
    let thisCollection = tipoVehiculo.ToString();
    const titles = {
        "TRACTOR" : "TRACTORES",
        "FURGON" : "FURGONES",
        "UTILITARIO" : "UTILITARIOS"
    }

    const collections = {
        "TRACTOR" : "tractores",
        "FURGON" : "furgones",
        "UTILITARIOS" : "utilitarios"
    }

    useEffect(() => {
        const obtenerDatos = async () => {
            setLoading(true);
            try{
                const querySnapshot = await getDocs(collection(db, collections.thisCollection));
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
        <section className="tablaVehiculo-container">
            
        </section>
    )
}
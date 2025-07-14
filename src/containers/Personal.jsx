import './css/Sections.css';
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Personal = () => {
    const [cantMecanicos, setCantMecanicos] = useState(0);
    const [cantChoferesLarga, setCantChoferesLarga] = useState(0);
    const [cantChoferesMovimiento, setCantChoferesMovimiento] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "personas"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const cantMecanicos = data.filter(mec => mec.puesto === "MECANICO");
                const cantChoferesLarga = data.filter(cl => cl.puesto === "CHOFER LARGA DISTANCIA")
                const cantChoferesMov = data.filter(cm => cm.puesto === "CHOFER MOVIMIENTO");
                setCantMecanicos(cantMecanicos.length);
                setCantChoferesLarga(cantChoferesLarga.length);
                setCantChoferesMovimiento(cantChoferesMov.length);
            } catch (error) {
                console.error("Error al obtener datos de Firestore: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="section-container">
            <div className="section-cards">
                <Card
                    title="Mecánicos"
                    value={loading ? "Cargando datos..." : `${cantMecanicos} activos`}
                    route="/mecanicos"
                />
                <Card
                    title="Choferes larga dist."
                    value={loading ? "Cargando datos..." : `${cantChoferesLarga} activos`}
                    route="/choferes-larga"
                />
                <Card
                    title="Choferes movimiento"
                    value={loading ? "Cargando datos..." : `${cantChoferesMovimiento} activos`}
                    route="/choferes-movimiento"
                />
            </div>
        </section>
    );
};

export default Personal;

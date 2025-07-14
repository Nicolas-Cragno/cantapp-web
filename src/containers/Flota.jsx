import './css/Sections.css';
import Card from "../components/Card";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";

const Flota = () => {
    const [cantTractores, setTractores] = useState(0);
    const [cantFurgones, setFurgones] = useState(0);
    const [cantUtilitarios, setUtilitarios] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => { // tractores
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "tractores"));
                const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

                const cantTractores = data.filter(tr => tr.estado === true || tr.estado === 1);

                setTractores(cantTractores.length);
            } catch(error){
                console.error("Error al obtener datos de Firestore: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => { // furgones
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "furgones"));
                const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

                const cantFurgones = data.filter(fg => fg.estado === true || fg.estado === 1);

                setFurgones(cantFurgones.length);
            } catch(error){
                console.error("Error al obtener datos de Firestore: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => { // utilitarios
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "utilitarios"));
                const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

                const cantUtilitarios = data.filter(ut => ut.estado === true || ut.estado === 1);

                setUtilitarios(cantUtilitarios.length);
            } catch(error){
                console.error("Error al obtener datos de Firestore: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <section className='section-container'>
            <div className='section-cards'>
                <Card 
                    title="Tractores"
                    value={loading ? "Cargando datos..." : `${cantTractores} activos`}
                    route="/tractores"
                />
                <Card 
                    title="Furgones"
                    value={loading ? "Cargando datos..." : `${cantFurgones} activos`}
                    route="/tractores"
                />
                <Card 
                    title="Utilitarios"
                    value={loading ? "Cargando datos..." : `${cantUtilitarios} activos`}
                    route="/tractores"
                />
            </div>
        </section>
    )
};

export default Flota;
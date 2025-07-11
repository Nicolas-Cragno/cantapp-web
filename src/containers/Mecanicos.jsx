import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "./css/Mecanicos.css";

const Mecanicos = () => {
    const [mecanicos, setMecanicos] = useState([]); // data del listado
    const [filtro, setFiltro] = useState(""); // filtro del listado
    const [loading, setLoading] = useState(true); // loading del listado

  useEffect(() => {
  const obtenerDatos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "personas"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const listadoMecanicos = data.filter(persona => persona.puesto === "MECANICO");

      setMecanicos(listadoMecanicos);
    } catch (error) {
      console.error("Error al obtener informacion desde db: ", error);
    } finally {
        setLoading(false);
    }
  };

    obtenerDatos();
  }, []);


  // Filtro
  const mecanicosFiltrados = mecanicos.filter((m) => {
  const nombreCompleto = `${m.nombres || ""} ${m.apellido || ""} ${m.detalle || ""}`;
  return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
});

  return (
    <section className="mecanicos-container">
        <div className="mecanicos-header">
            <h1 className="mecanicos-title">MECANICOS</h1>
            <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="mecanicos-busqueda"
            />
        </div>

        <ul className="mecanicos-lista">
            {loading ? (
                <li className="loading-item">Cargando datos...</li>
            ) : mecanicosFiltrados.length > 0 ? (
                mecanicosFiltrados.map((mecanico) => (
                <li key={mecanico.id} className="mecanico-item">
                    <span className="mecanico-nombre">{mecanico.apellido}, {mecanico.nombres}</span>
                    <span className="mecanico-info">{mecanico.detalle}</span>
                </li>
                ))
            ) : (
                <li className="loading-item">No se encontraron mecánicos.</li>
            )}
        </ul>

        <div className="mecanicos-options">
            <button className="mecanicos-agregar">+ Agregar Mecánico</button>
        </div>
    </section>
  );
};

export default Mecanicos;

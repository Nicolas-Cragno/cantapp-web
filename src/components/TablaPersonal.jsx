import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "./css/TablaPersonal.css";

const TablaPersonal = (props) => {
    const { tipoPuesto } = props;
    const [personas, setPersonas] = useState([]); // data del listado
    const [filtro, setFiltro] = useState(""); // filtro del listado
    const [loading, setLoading] = useState(true); // loading del listado

    const titles = {
      "EMPLEADO": "EMPLEADOS",
      "MECANICO": "MECANICOS",
      "CHOFER LARA DISTANCIA": "CHOFERES DE LARGA",
      "CHOFER MOVIMIENTO": "CHOFERES MOVIMIMIENTO",
      "FLETERO": "FLETEROS",
      "ADMINISTRATIVO": "ADMINISTRATIVOS"
    }

    const title = titles[tipoPuesto] || "EMPLEADO";

  useEffect(() => {
  const obtenerDatos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "personas"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const listadoPersonas = data.filter(ps => ps.puesto === tipoPuesto);

      setPersonas(listadoPersonas);
    } catch (error) {
      console.error("Error al obtener informacion desde db: ", error);
    } finally {
        setLoading(false);
    }
  };

    obtenerDatos();
  }, []);


  // Filtro
  const personasFiltradas = personas.filter((p) => {
  const nombreCompleto = `${p.nombres || ""} ${p.apellido || ""} ${p.detalle || ""}`;
  return nombreCompleto.toLowerCase().includes(filtro.toLowerCase());
});

  return (
    <section className="fichapersonal-container">
        <div className="fichapersonal-header">
            <h1 className="fichapersonal-title">{title}</h1>
            <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="fichapersonal-busqueda"
            />
        </div>

        <ul className="fichapersonal-lista">
            {loading ? (
                <li className="loading-item">Cargando datos...</li>
            ) : personasFiltradas.length > 0 ? (
                personasFiltradas.map((persona) => (
                <li key={persona.id} className="fichapersonal-item">
                    <span className="fichapersonal-nombre">{persona.apellido}, {persona.nombres}</span>
                    <span className="fichapersonal-info">{persona.detalle}</span>
                </li>
                ))
            ) : (
                <li className="loading-item">No se encontraron {tipoPuesto}.</li>
            )}
        </ul>

        <div className="fichapersonal-options">
            <button className="fichapersonal-agregar">+ AGREGAR</button>
        </div>
    </section>
  );
};

export default TablaPersonal;

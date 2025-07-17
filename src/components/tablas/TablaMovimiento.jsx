import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions"; 
import { formatearFecha } from "../../functions/data-functions";
import "../css/Tables.css";

const TablaMovimiento = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const title = "MOVIMIENTOS";

  useEffect(() => {
    const obtenerDatos = async () => {
      setLoading(true);
      try {
        const datos = await listarColeccion("eventos"); // Usamos función centralizada con cache
        const movimientosFiltrados = datos.filter(e => e.tipo === "MOVIMIENTO");
        setMovimientos(movimientosFiltrados);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  // Filtro local
  const eventosFiltrados = movimientos.filter((m) => {
    const fechaTxt = formatearFecha(m.fecha);
    const textoFiltro = `${m.subtipo || ""} ${m.persona || ""} ${m.tractor || ""} ${m.furgon || ""} ${fechaTxt}`;
    return textoFiltro.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
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
          <li className="loading-item"><FaSpinner className="spinner" /></li>
        ) : eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((movimiento) => (
            <li key={movimiento.id} className="table-item">
              <span className="table-nombre">{movimiento.subtipo}</span>
              <span className="table-info">{movimiento.persona}</span>
              <span className="table-info">Tractor: {movimiento.tractor}</span>
              <span className="table-info">Furgón: {movimiento.furgon}</span>
              <span className="table-info">{formatearFecha(movimiento.fecha)}</span>
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
  );
};

export default TablaMovimiento;

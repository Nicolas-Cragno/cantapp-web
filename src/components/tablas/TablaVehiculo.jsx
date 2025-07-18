import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions";
import FichaVehiculo from "../fichas/FichaVehiculo";
import FormularioVehiculo from "../forms/FormularioVehiculo";
import "../css/Tables.css";

const TablaVehiculo = ({ tipoVehiculo }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  const title = tipoVehiculo.toUpperCase();

  const obtenerDatos = async (usarCache = true) => {
    setLoading(true);
    try {
      const data = await listarColeccion(tipoVehiculo, usarCache);
      const listadoVehiculos = data.filter((v) => v.estado === 1 || v.estado === true);
      setVehiculos(listadoVehiculos);
    } catch (error) {
      console.error("Error al obtener información desde db: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [tipoVehiculo]);

  const handleClickVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
  };

  const cerrarModal = () => {
    setVehiculoSeleccionado(null);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  // Esta función se llama cuando se agrega o modifica un vehículo,
  // y fuerza recarga desde Firestore (sin usar cache localStorage)
  const handleGuardar = async () => {
    await obtenerDatos(false); // forzar recarga directa desde Firestore
    cerrarModal();
    cerrarModalAgregar();
  };

  const vehiculosFiltrados = vehiculos.filter((v) => {
    const texto = `${v.dominio || ""} ${v.interno || ""} ${v.detalle || ""}`;
    return texto.toLowerCase().includes(filtro.toLowerCase());
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
          <li className="loading-item">
            <FaSpinner className="spinner" />
          </li>
        ) : vehiculosFiltrados.length > 0 ? (
          vehiculosFiltrados.map((vehiculo) => (
            <li
              key={vehiculo.id}
              className="table-item"
              onClick={() => handleClickVehiculo(vehiculo)}
            >
              <span className="table-nombre">
                {vehiculo.interno} - {vehiculo.dominio}
              </span>
              <span className="table-info">{vehiculo.detalle}</span>
            </li>
          ))
        ) : (
          <li className="loading-item">No se encontraron {tipoVehiculo.toLowerCase()}s</li>
        )}
      </ul>

      {vehiculoSeleccionado && (
        <FichaVehiculo
          vehiculo={vehiculoSeleccionado}
          tipoVehiculo={tipoVehiculo}
          onClose={cerrarModal}
          onGuardar={handleGuardar}
        />
      )}

      {modalAgregarVisible && (
        <FormularioVehiculo
          tipoVehiculo={tipoVehiculo}
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
        />
      )}

      <div className="table-options">
        <button className="table-agregar" onClick={() => setModalAgregarVisible(true)}>
          + AGREGAR
        </button>
      </div>
    </section>
  );
};

export default TablaVehiculo;

import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions";
import {nombreEmpresa} from "../../functions/data-functions";
import LogoEmpresaTxt from "../LogoEmpresaTxt";
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

  const handleGuardar = async () => {
    await obtenerDatos(false);
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

      {loading ? (
        <div className="loading-item">
          <FaSpinner className="spinner"/>
        </div>
      ) : (
        <div className="table-scroll-wrapper">
          <table className="table-lista">
            <thead className="table-titles">
              <tr>
                <th>INTERNO</th>
                <th>PATENTE</th>
                <th>MARCA</th>
                <th>MODELO</th>
                <th>EMPRESA</th>
              </tr>
            </thead>
          </table>

          <div className="table-body-wrapper">
            <table className="table-lista">
              <tbody className="table-body">
                {vehiculosFiltrados.map((vehiculo) => (
                  <tr key={vehiculo.id} onClick={() => handleClickVehiculo(vehiculo)} className="table-item">
                    <td>{vehiculo.interno}</td>
                    <td>{vehiculo.dominio}</td>
                    <td>{vehiculo.marca}</td>
                    <td>{vehiculo.modelo === 0 ? ("") : (vehiculo.modelo)}</td>
                    <td><LogoEmpresaTxt cuitEmpresa={vehiculo.empresa}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      

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

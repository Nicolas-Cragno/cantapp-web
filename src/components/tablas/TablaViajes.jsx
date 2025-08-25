import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { FaCheckSquare as OkLogo } from "react-icons/fa";
import {
  colorSatelital,
  colorBatman,
  colorPromedio,
} from "../../functions/data-functions";
import { ImFileEmpty as EmptyLogo } from "react-icons/im";

import {
  listarColeccion,
  useDetectarActualizaciones,
  buscarDniPorNombre,
} from "../../functions/db-functions";
import { formatearFecha } from "../../functions/data-functions";
import FichaViaje from "../fichas/FichaViaje";
import FormularioViaje from "../forms/FormularioViaje";
import LogoCombustible from "../../assets/logos/logo.svg";
import "./css/Tables.css";
import AlertButton from "../buttons/AlertButton";

const TablaViajes = () => {
  const [viajes, setViajes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const title = "CONTROL COMBUSTIBLE";

  const cargarViajes = async (usarCache = true) => {
    setLoading(true);
    try {
      const datos = await listarColeccion("viajes", usarCache);
      setViajes(datos);
    } catch (error) {
      console.error("Error al obtener listado de viajes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarViajes();
  }, []);

  const handleClickViaje = (viaje) => {
    setViajeSeleccionado(viaje);
  };

  const cerrarModalFicha = () => {
    setViajeSeleccionado(null);
  };

  const handleGuardar = async () => {
    await cargarViajes(false);
    // setModalAgregarVisible(false);
    setViajeSeleccionado(null);
  };

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img src={LogoCombustible} alt="" className="table-logo" />
          {title}
        </h1>

        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="table-busqueda"
        />

        {loading ? (
          <div className="loading-item">
            <FaSpinner className="spinner" />
          </div>
        ) : (
          <div className="table-scroll-wrapper">
            <table className="table-lista">
              <thead className="table-titles">
                <tr>
                  <th>FECHA</th>
                  <th>VIAJE</th>
                  <th>CHOFER</th>
                  <th>TRACTOR</th>
                  <th>SATELITAL</th>
                  <th>TICKETS</th>
                  <th>LITROS REALES</th>
                  <th>DISTANCIA</th>
                  <th>DIFERENCIA</th>
                  <th>PROMEDIO</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
            </table>
            <div className="table-body-wrapper">
              <table className="table-lista">
                <tbody className="table-body">
                  {viajes?.map((viaje) => (
                    <tr
                      key={viaje.id}
                      onClick={() => handleClickViaje(viaje)}
                      className="table-item"
                    >
                      <td>{formatearFecha(viaje.fecha)}</td>
                      <td>{viaje.id}</td>
                      <td>{viaje.chofer || "SIN ASIGNAR"}</td>
                      <td>{viaje.tractor || "SIN ASIGNAR"}</td>
                      <td
                        className="txt-satelital"
                        style={{
                          backgroundColor: colorSatelital(viaje.satelital),
                        }}
                      >
                        {viaje.satelital || "N/F"}
                      </td>
                      <td>{Number(viaje.litrosticket || 0).toFixed(2)}</td>
                      <td>{Number(viaje.litrosreales || 0).toFixed(2)}</td>
                      <td>{Number(viaje.km || 0).toFixed(2)}</td>
                      <td
                        style={{
                          color: colorBatman(viaje.diferencia),
                          fontWeight: "bolder",
                        }}
                      >
                        {Number(viaje.diferencia || 0).toFixed(2)}
                      </td>
                      <td style={{ color: colorPromedio(viaje.promedio) }}>
                        {Number(viaje.promedio || 0).toFixed(2)}
                      </td>
                      <td>
                        {viaje.estado === true ? (
                          <OkLogo className="ok-logo" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viajeSeleccionado && (
          <FichaViaje
            viaje={viajeSeleccionado}
            onGuardar={handleGuardar}
            onClose={cerrarModalFicha}
          />
        )}

        <div className="table-options">
          <button
            className="table-agregar"
            /* onClick={() => setModalAgregarVisible(true)} */
          >
            + AGREGAR
          </button>
        </div>
      </div>
    </section>
  );
};

export default TablaViajes;

import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { listarColeccion } from "../../functions/db-functions";
import { nombreEmpresa } from "../../functions/data-functions";
import { obtenerCuitPorNombre } from "../../functions/data-functions";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";
import FichaVehiculo from "../fichas/FichaVehiculo";
import FormularioVehiculo from "../forms/FormularioVehiculo";
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logofurgon-w.png";
import LogoUtilitario from "../../assets/logos/logoutilitario-w.png";
import "./css/Tables.css";

const TablaVehiculo = ({ tipoVehiculo }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [cantVehiculosTC, setCantVehiculosTC] = useState(0);
  const [cantVehiculosEX, setCantVehiculosEX] = useState(0);
  const [cantVehiculosTA, setCantVehiculosTA] = useState(0);
  const [cantVehiculosX, setCantVehiculosX] = useState(0);
  const [filtroTC, setFiltroTC] = useState(true);
  const [filtroEX, setFiltroEX] = useState(true);
  const [filtroTA, setFiltroTA] = useState(true);
  const [filtroX, setFiltroX] = useState(true);
  const [editar, setEditar] = useState(false); // por defecto no puede editar a menos que sea admin o dev
  const usuarioJSON = localStorage.getItem("usuario");
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

  const title = tipoVehiculo.toUpperCase();

  const obtenerDatos = async (usarCache = true) => {
    setLoading(true);
    try {
      const data = await listarColeccion(tipoVehiculo, usarCache);
      const empresaTC = Number(obtenerCuitPorNombre("TRANSPORTES CANTARINI"));
      const empresaEX = Number(obtenerCuitPorNombre("EXPRESO CANTARINI"));
      const empresaTA = Number(
        obtenerCuitPorNombre("TRANSAMERICA TRANSPORTES")
      );
      const listadoVehiculos = data.filter(
        (v) => v.estado === 1 || v.estado === true
      );
      setCantVehiculosTC(data.filter((v) => v.empresa === empresaTC).length);
      setCantVehiculosEX(data.filter((v) => v.empresa === empresaEX).length);
      setCantVehiculosTA(data.filter((v) => v.empresa === empresaTA).length);
      setCantVehiculosX(
        data.filter(
          (v) =>
            v.empresa !== empresaTC &&
            v.empresa !== empresaEX &&
            v.empresa !== empresaTA &&
            (v.empresa === null || v.empresa === "")
        ).length
      );
      setVehiculos(listadoVehiculos);
    } catch (error) {
      console.error("Error al obtener información desde db: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();

    if (usuario?.rol === "admin" || usuario?.rol === "dev") {
      setEditar(true);
    }
  }, [tipoVehiculo, usuario]);

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

  const vehiculosFiltrados = vehiculos
    .filter((v) => {
      const texto = `${v.interno || ""} ${v.dominio || ""} ${v.marca} ${
        v.modelo
      }`;
      return texto.toLowerCase().includes(filtro.toLowerCase());
    })
    .filter((v) => {
      if (
        (filtroTC && v.empresa === 30610890403) ||
        v.empresa === "30610890403"
      )
        return true;
      if (
        (filtroTA && v.empresa === 30683612916) ||
        v.empresa === "30683612916"
      )
        return true;
      if (
        (filtroEX && v.empresa === 30644511304) ||
        v.empresa === "30644511304"
      )
        return true;
      if ((filtroX && v.empresa === null) || v.empresa === "") return true;
    })
    .sort((a, b) => {
      return (a.interno || 0) - (b.interno || 0);
    });

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img
            src={
              title === "TRACTORES"
                ? LogoTractor
                : title === "FURGONES"
                ? LogoFurgon
                : LogoUtilitario
            }
            alt=""
            className="table-logo"
          />
          {title}
        </h1>
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="table-busqueda"
        />
        <div className="table-checked">
          <label className="table-check">
            <input
              type="checkbox"
              checked={filtroTC}
              onChange={(e) => setFiltroTC(e.target.checked)}
              className="check-input"
            />
            TC ({cantVehiculosTC})
          </label>
          <label className="table-check">
            <input
              type="checkbox"
              checked={filtroEX}
              onChange={(e) => setFiltroEX(e.target.checked)}
              className="check-input"
            />
            EX ({cantVehiculosEX})
          </label>
          <label className="table-check">
            <input
              type="checkbox"
              checked={filtroTA}
              onChange={(e) => setFiltroTA(e.target.checked)}
              className="check-input"
            />
            TA ({cantVehiculosTA})
          </label>
          <label className="table-check">
            <input
              type="checkbox"
              checked={filtroX}
              onChange={(e) => setFiltroX(e.target.checked)}
              className="check-input"
            />
            Innactivos ({cantVehiculosX})
          </label>
        </div>
      </div>

      {loading ? (
        <div className="loading-item">
          <FaSpinner className="spinner" />
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
                  <tr
                    key={vehiculo.id}
                    onClick={() => handleClickVehiculo(vehiculo)}
                    className="table-item"
                  >
                    <td>{vehiculo.interno}</td>
                    <td>{vehiculo.dominio}</td>
                    <td>{vehiculo.marca}</td>
                    <td>{vehiculo.modelo === 0 ? "" : vehiculo.modelo}</td>
                    <td>
                      <LogoEmpresaTxt cuitEmpresa={vehiculo.empresa} />
                    </td>
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

      {modalAgregarVisible && editar && (
        <FormularioVehiculo
          tipoVehiculo={tipoVehiculo}
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
        />
      )}

      {editar && (
        <div className="table-options">
          <button
            className="table-agregar"
            onClick={() => setModalAgregarVisible(true)}
          >
            + AGREGAR
          </button>
        </div>
      )}
    </section>
  );
};

export default TablaVehiculo;

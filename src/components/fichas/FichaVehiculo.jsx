import "./css/Fichas.css";
import { nombreEmpresa } from "../../functions/data-functions";
import { useState, useEffect } from "react";
import FormularioVehiculo from "../forms/FormularioVehiculo";
import { listarColeccion } from "../../functions/db-functions";

const FichaVehiculo = ({ vehiculo, tipoVehiculo, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventos, setEventos] = useState([]);

  const cargarEventos = async () => {
    try {
      const data = await listarColeccion("eventos");
      const dataFiltrada = data.filter((e) => {
        if (Array.isArray(e.tractor)) {
          return e.tractor.includes(vehiculo.id);
        }
        return e.tractor === vehiculo.id;
      });
      const dataOrdenada = dataFiltrada.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaB - fechaA; // más nuevo primero
      });
      setEventos(dataOrdenada);
    } catch (error) {
      console.log("Error al listar eventos: ", error);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const empresa = nombreEmpresa(vehiculo.empresa);

  const handleGuardado = async (vehiculoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(vehiculoModificado);
  };

  const minimizarTipo = (tipoMax) => {
    let auxTipo;
    switch (tipoMax) {
      case "utilitarios":
        auxTipo = "UTILITARIO";
        break;
      case "tractores":
        auxTipo = "TRACTOR";
        break;
      case "furgones":
        auxTipo = "FURGON";
        break;
      default:
        auxTipo = "SIN ASIGNAR";
        break;
    }

    return auxTipo;
  };

  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}>
              {" "}
              ✕{" "}
            </button>
            <h1 className="vehiculo-name">
              <strong className="dominio">{vehiculo.dominio}</strong>
              <span className="interno"> {vehiculo.interno} </span>
            </h1>
            <hr />
            <p className="puesto">
              <strong>{minimizarTipo(tipoVehiculo)}</strong>
            </p>
            <div className="ficha-info">
              <p>
                <strong>Marca: </strong>
                {vehiculo.marca || ""}
              </p>
              <p>
                <strong>Modelo: </strong>
                {vehiculo.modelo || ""}
              </p>
              <p>
                <strong>Empresa: </strong>
                {empresa}
              </p>
              <p>
                <strong>Detalle: </strong>
                {vehiculo.detalle || ""}
              </p>
            </div>
            {/*
            <div className="ficha-eventos">
              <h2>Eventos</h2>
              {eventos.length > 0 ? (
                <ul>
                  {eventos.map((e) => (
                    <li key={e.id}>
                      {e.fecha} - {e.detalle || "Sin detalle"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay eventos registrados</p>
              )}
            </div>
            */}
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormularioVehiculo
          tipoVehiculo={tipoVehiculo}
          vehiculo={vehiculo}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaVehiculo;

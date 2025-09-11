import "./css/Fichas.css";
import {
  nombreEmpresa,
  formatearFecha,
  buscarPersona,
  formatearHora,
} from "../../functions/data-functions";
import { MdEventNote } from "react-icons/md";
import FichaEventoPorteria from "./FichaEventoPorteria";
import FichaLlavePorteria from "./FichaLlavePorteria";
import FichaViaje from "./FichaViaje";
import { useState, useEffect } from "react";
import FormularioVehiculo from "../forms/FormularioVehiculo";
import { listarColeccion } from "../../functions/db-functions";
import { FaKey } from "react-icons/fa6";
import { IoEnterSharp } from "react-icons/io5";
import { FaRoute } from "react-icons/fa";

import { IoLogOutSharp } from "react-icons/io5";

const FichaVehiculo = ({ vehiculo, tipoVehiculo, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const cargarEventos = async () => {
    try {
      const data = await listarColeccion("eventos");
      const dataFiltrada = data.filter((e) => {
        const idVehiculo = Number(vehiculo.id);

        switch (minimizarTipo(tipoVehiculo).toLowerCase()) {
          case "tractor":
            if (Array.isArray(e.tractor)) {
              return e.tractor.includes(idVehiculo);
            }

            return Number(e.tractor) === idVehiculo;
            break;
          case "furgon":
            if (Array.isArray(e.furgon)) {
              return e.furgon.includes(idVehiculo);
            }

            return Number(e.furgon) === idVehiculo;
            break;
          case "utilitario":
            if (Array.isArray(e.utilitario)) {
              return e.utilitario.includes(idVehiculo);
            }

            return Number(e.utilitario) === idVehiculo;
            break;
          default:
            if (Array.isArray(e.vehiculo)) {
              return e.vehiculo.includes(idVehiculo);
            }

            return Number(e.vehiculo) === idVehiculo;
            break;
        }
      });

      const dataOrdenada = dataFiltrada.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaB - fechaA; // más nuevo primero
      });

      /*
      const dataFull = await Promise.all(
        dataOrdenada.map(async (e) => {
          if (e.persona) {
            const personaNombre = await buscarPersona(e.persona);
            return {
              ...e,
              nPersona: personaNombre,
            };
          }
          return e;
        })
      ); */

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

            {eventos.length > 0 ? (
              <>
                <p className="ficha-info-title">
                  <strong>EVENTOS</strong>
                </p>
                <div className="ficha-info-box">
                  {eventos.map((e) => (
                    <p
                      key={e.id}
                      className="item-list"
                      onClick={() => setEventoSeleccionado(e)}
                    >
                      {/* ---------------------------------------------------------------- TIPOS */}
                      {/* ----------------------------- PORTERIA */}
                      {e.tipo === "ENTREGA" ||
                      e.tipo === "RETIRA" ||
                      e.tipo === "DEJA" ? (
                        <>
                          <FaKey /> {e.tipo} LLAVES
                        </>
                      ) : null}
                      {e.tipo === "ENTRADA" && (
                        <>
                          <IoEnterSharp /> {e.tipo}
                          {e.cargado && (
                            <span className="infobox-mini redbox">Cargado</span>
                          )}
                        </>
                      )}
                      {e.tipo === "SALIDA" && (
                        <>
                          <IoLogOutSharp /> {e.tipo}
                          {e.cargado && (
                            <span className="infobox-mini redbox">Cargado</span>
                          )}
                        </>
                      )}
                      {/* ----------------------------- COMBUSTIBLE */}
                      {e.tipo === "VIAJE" ||
                        (e.tipo === "viaje" && (
                          <>
                            <FaRoute /> {e.tipo.toUpperCase()}
                          </>
                        ))}
                      <span>
                        {formatearFecha(e.fecha)} | {formatearHora(e.fecha)} hs
                      </span>{" "}
                    </p>
                  ))}
                </div>
              </>
            ) : null}
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

      {eventoSeleccionado &&
        (["ENTREGA", "DEJA", "RETIRA"].includes(eventoSeleccionado.tipo) ? (
          <FichaLlavePorteria
            evento={eventoSeleccionado}
            onClose={() => setEventoSeleccionado(null)}
          />
        ) : ["ENTRADA", "SALIDA"].includes(eventoSeleccionado.tipo) ? (
          <FichaEventoPorteria
            evento={eventoSeleccionado}
            onClose={() => setEventoSeleccionado(null)}
          />
        ) : eventoSeleccionado.tipo === "viaje" ||
          eventoSeleccionado.tipo === "VIAJE" ? (
          <FichaViaje
            evento={eventoSeleccionado}
            onClose={() => setEventoSeleccionado(null)}
          />
        ) : null)}
    </>
  );
};

export default FichaVehiculo;

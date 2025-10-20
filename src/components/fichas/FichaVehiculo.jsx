// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import { FaKey } from "react-icons/fa6";
import { IoEnterSharp } from "react-icons/io5";
import { FaRoute } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { nombreEmpresa } from "../../functions/data-functions";

import {
  buscarEmpresa,
  formatearFecha,
  formatearHora,
} from "../../functions/dataFunctions";
import FichaEventosGestor from "./FichaEventosGestor";
import FichaEventoPorteria from "./FichaEventoPorteria";
import FichaLlave from "./FichaLlave";
import FichaViaje from "./FichaViaje";
import FormVehiculo from "../forms/FormVehiculo";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Fichas.css";
import { buscarPersona } from "../../functions/dataFunctions";

const FichaVehiculo = ({ elemento, tipoVehiculo, onClose, onGuardar }) => {
  const vehiculo = elemento;
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const { personas, eventos, empresas } = useData();
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  const cargarEventos = async () => {
    try {
      const listaFiltrada = eventos.filter((e) => {
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

      const dataOrdenada = listaFiltrada.sort((a, b) => {
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
      setEventosFiltrados(dataOrdenada);
    } catch (error) {
      console.log("Error al listar eventos: ", error);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const empresa = buscarEmpresa(empresas, vehiculo.empresa);
  const persona = buscarPersona(personas, vehiculo.persona);

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
              {vehiculo.empresa ? (
                <p>
                  <strong>Empresa: </strong>
                  {empresa}
                </p>
              ) : null}
              {vehiculo.persona && (
                <p>
                  <strong>Conduce: </strong>
                  {persona}
                </p>
              )}
              <p>
                <strong>Detalle: </strong>
                {vehiculo.detalle || ""}
              </p>
            </div>

            {eventosFiltrados.length > 0 ? (
              <>
                <p className="ficha-info-title">
                  <strong>EVENTOS</strong>
                </p>
                <div className="ficha-info-box">
                  {eventosFiltrados.map((e) => (
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
            {onGuardar ? (
              <div className="ficha-buttons">
                <button onClick={() => setModoEdicion(true)}>Editar</button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <FormVehiculo
          tipoVehiculo={tipoVehiculo}
          vehiculo={vehiculo}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}

      {eventoSeleccionado && (
        <FichaEventosGestor
          tipo={
            eventoSeleccionado.tipo === "DEJA" ||
            eventoSeleccionado.tipo === "RETIRA" ||
            eventoSeleccionado.tipo === "ENTREGA"
              ? "llave"
              : eventoSeleccionado.tipo
          }
          elemento={eventoSeleccionado}
          onClose={() => setEventoSeleccionado(null)}
          onGuardar={onGuardar}
        />
      )}
    </>
  );
};

export default FichaVehiculo;

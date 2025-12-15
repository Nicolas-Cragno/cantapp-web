// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import { FaKey as LogoKey } from "react-icons/fa6";
import { FaRoute as LogoRoute } from "react-icons/fa";
import {
  IoEnterSharp as LogoEnter,
  IoLogOutSharp as LogoOut,
} from "react-icons/io5";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import {
  buscarPersona,
  buscarEmpresa,
  formatearFecha,
  formatearFechaCorta,
  formatearHora,
  buscarNombre,
  buscarId,
} from "../../functions/dataFunctions";
import {
  cambiarEstadoSatelital,
  ventaVehiculo,
  altaBaja,
  modificar,
} from "../../functions/dbFunctions";
import { agregarEvento } from "../../functions/eventFunctions";
import FichaEventosGestor from "./FichaEventosGestor";
import FormVehiculo from "../forms/FormVehiculo";
import FormToDolist from "../forms/FormToDoList";
import "./css/Fichas.css";

const FichaVehiculo = ({ elemento, tipoVehiculo, onClose, onGuardar }) => {
  const vehiculo = elemento;
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [estadoSatelital, setEstadoSatelital] = useState(false);
  const { personas, eventos, empresas, stock, usuario } = useData();
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [modalProgramarVisible, setModalProgramarVisible] = useState(false);

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
        const fechaA = a.fecha?.toDate?.() ?? new Date(0);
        const fechaB = b.fecha?.toDate?.() ?? new Date(0);
        return fechaA - fechaB;
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
  useEffect(() => {
    let auxEstadoSatelital =
      vehiculo.estadoSatelital === "1" ||
      vehiculo.estadoSatelital === 1 ||
      vehiculo.estadoSatelital === true;

    setEstadoSatelital(auxEstadoSatelital);
  }, [vehiculo]);
  const empresa = buscarEmpresa(empresas, vehiculo.empresa);
  const persona = buscarPersona(personas, vehiculo.persona);
  const satelital = buscarEmpresa(empresas, vehiculo.satelital);
  const handleGuardado = async (vehiculoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(vehiculoModificado);
  };
  const handleBajaSatelital = async () => {
    Swal.fire({
      title: `SEGUIMIENTO SATELITAL`,
      text: `¿Desea cambiar estado del satelital del interno ${vehiculo.id} a innactivo?`,
      showCancelButton: true,
      confirmButtonText: "CONFIRMAR",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const auxEmpresa = buscarId(empresas, "nombre", vehiculo.satelital);
        await cambiarEstadoSatelital(
          "tractores",
          vehiculo.id,
          auxEmpresa,
          false
        );

        const datosBajaSat = {
          fecha: new Date(),
          tipo: "SATELITAL",
          tractor: vehiculo.id,
          empresa: auxEmpresa,
          detalle: "BAJA DEL SATELITAL",
        };

        await agregarEvento(datosBajaSat, "satelital");
        setEstadoSatelital(false);
        cargarEventos();
      }
    });
  };
  const handleAltaSatelital = async () => {
    const empresasSatelital = empresas?.filter(
      (e) => e.tipo === "proveedor" && (e.combustible || e.ubicacion)
    );
    let empresasOptions = {};
    empresasSatelital.forEach((e) => {
      empresasOptions[e.id] = e.nombre;
    });
    Swal.fire({
      title: `SEGUIMIENTO SATELITAL`,
      text: `¿Desea cambiar estado del satelital del interno ${vehiculo.id} a innactivo?`,
      icon: "question",
      input: "select",
      inputOptions: empresasOptions,
      inputPlaceholder: "Seleccionar un satelital",
      showCancelButton: true,
      confirmButtonText: "CONFIRMAR",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const auxEmpresa = result.value;
        await cambiarEstadoSatelital(
          "tractores",
          vehiculo.id,
          auxEmpresa,
          true
        );

        const datosAltaSat = {
          fecha: new Date(),
          tipo: "SATELITAL",
          tractor: vehiculo.id,
          empresa: auxEmpresa,
          detalle: "ALTA DEL SATELITAL",
        };

        await agregarEvento(datosAltaSat, "satelital");

        setEstadoSatelital(true);
        cargarEventos();
      }
    });
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
  const handleBaja = () => {
    if (usuario.rol === "superadmin" || usuario.rol === "dev") {
      Swal.fire({
        title: `BAJA ${minimizarTipo(tipoVehiculo)}`,
        text: `${vehiculo.interno} (${vehiculo.dominio})`,
        icon: "warning",
        input: "text",
        inputPlaceholder: "Detalle",
        showConfirmButton: true,
        confirmButtonText: "Baja normal",
        showDenyButton: true,
        denyButtonText: "Venta",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isDismissed) return;

        const motivo = result.value || "Sin motivo";
        const esVenta = result.isDenied;

        const datosBaja = {
          fecha: new Date(),
          tipo: esVenta ? "VENTA" : "BAJA",
          tractor: tipoVehiculo === "tractores" ? vehiculo.id : "",
          furgon: tipoVehiculo === "furgones" ? vehiculo.id : "",
          vehiculo: tipoVehiculo === "vehiculos" ? vehiculo.id : "",
          detalle: motivo,
        };

        try {
          if (esVenta) {
            await ventaVehiculo(tipoVehiculo, vehiculo.id);
          }

          await altaBaja(tipoVehiculo, vehiculo.id, false);

          elemento.estado = false;
          elemento.empresa = null;
          elemento.vendido = esVenta;

          await agregarEvento(datosBaja, "administracion");
          await modificar(tipoVehiculo, vehiculo.id, { estado: false });

          onClose();
        } catch (error) {
          console.error("Error al registrar baja:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo completar la baja.",
            icon: "error",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4161bd",
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No posee autorización para esta acción.",
      });
    }
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
              <strong className="dominio">{vehiculo.dominio} </strong>
              <span className="interno"> {vehiculo.interno} </span>
            </h1>
            {vehiculo.vendido ? (
              <>
                <p className={"ficha-info-title2 yellowbox2"}>
                  <strong>
                    VENDIDO{" "}
                    {vehiculo.fechaVenta
                      ? formatearFecha(vehiculo.fechaVenta)
                      : ""}
                  </strong>
                </p>
              </>
            ) : (
              ""
            )}
            <hr />
            <div className="info-subname">
              <strong>{minimizarTipo(tipoVehiculo)}</strong>
              {usuario["rol"] !== "user" &&
                (vehiculo.estado ? (
                  <p
                    className="info-minitext stateBox greenlightbox"
                    onClick={handleBaja}
                  >
                    activo{" "}
                  </p>
                ) : (
                  <p className="info-minitext stateBox greylightbox">
                    innactivo{" "}
                  </p>
                ))}
            </div>
            {vehiculo.faltantes && (
              <>
                <p className="ficha-info-title redbox2 spaceright">
                  <strong>FALTANTES</strong>
                </p>
                <div className="ficha-info-box">
                  {vehiculo.faltantes.map((e) => (
                    <p key={e.id} className="item-list">
                      <span>
                        <strong>{e.idFaltante}</strong>{" "}
                        {buscarNombre(stock, e.idFaltante)}
                      </span>{" "}
                      <span className="cant-detail">x{e.cantidad}</span>
                    </p>
                  ))}
                </div>
              </>
            )}
            <>
              <p
                className={`ficha-info-title ${
                  vehiculo.pendientes && vehiculo.pendientes.length > 0
                    ? "yellowbox"
                    : "greenlightbox"
                } spaceright`}
              >
                <strong>PARTE DEL {minimizarTipo(tipoVehiculo)}</strong>
              </p>
              <div className="ficha-info-box">
                {vehiculo.pendientes ? (
                  <>
                    {vehiculo.pendientes.map((pend) => (
                      <p key={pend.id} className="item-list">
                        <span>
                          <strong className="item-blue2">{pend.tipo}</strong>{" "}
                          {pend.detalle.toUpperCase()}
                        </span>
                        <span className="cant-detail">
                          {formatearFechaCorta(pend.fecha)}
                        </span>
                      </p>
                    ))}
                  </>
                ) : (
                  <span>
                    Sin pendientes, arreglos o limitantes para circular
                  </span>
                )}
              </div>
              <div className="ficha-info-footer">
                <span
                  className="stateBox2 linker"
                  onClick={() => setModalProgramarVisible(true)}
                >
                  EDITAR
                </span>
              </div>
            </>
            <p className="ficha-info-title">
              <strong>INFORMACIÓN</strong>
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
              {vehiculo.motor && (
                <p>
                  <strong>Motor: </strong> {vehiculo.motor}
                </p>
              )}
              {vehiculo.chasis && (
                <p>
                  <strong>Chasis: </strong> {vehiculo.chasis}
                </p>
              )}

              <p>
                <strong>Detalle: </strong>
                {vehiculo.detalle || ""}
              </p>
            </div>
            <p className="ficha-info-title">
              <strong>EMPRESA</strong>
            </p>
            <div className="ficha-info-box">
              {" "}
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
            </div>{" "}
            {tipoVehiculo === "tractores" && (
              <>
                <p className="ficha-info-title">
                  <strong>SATELITAL</strong>
                </p>
                <div className="ficha-info-box">
                  <p>
                    <strong>Satelital: </strong>
                    {satelital}{" "}
                    <span
                      className={`stateBox2 linker ${
                        estadoSatelital || estadoSatelital === 1
                          ? "greenbox"
                          : "redbox"
                      }`}
                      onClick={
                        estadoSatelital || estadoSatelital === 1
                          ? handleBajaSatelital
                          : handleAltaSatelital
                      }
                    >
                      {estadoSatelital || estadoSatelital === 1
                        ? "ACTIVO"
                        : "NO TIENE"}
                    </span>
                  </p>

                  {vehiculo.comentarioSatelital ? (
                    <p>
                      <strong>Comentario: </strong>
                      {vehiculo.comentarioSatelital}
                    </p>
                  ) : null}
                  {vehiculo.detalleSatelital ? (
                    <p>
                      <strong>Detalle: </strong>
                      {vehiculo.detalleSatelital}
                    </p>
                  ) : null}
                </div>
              </>
            )}
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
                      <span className="list-cant3">
                        {formatearFecha(e.fecha)}
                      </span>{" "}
                      <strong>{e.tipo.toUpperCase()}</strong>
                      <span className="infobox-mini2">
                        {e.detalle?.slice(0, 10)} ...
                      </span>
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
      {modalProgramarVisible && (
        <FormToDolist
          tipoVehiculo={tipoVehiculo}
          vehiculo={vehiculo}
          onClose={() => setModalProgramarVisible(false)}
          onGuardar={() => onClose()}
        />
      )}
    </>
  );
};

export default FichaVehiculo;

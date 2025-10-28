// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import {
  BsPersonDash as LogoPersonDash,
  BsPersonCheck as LogoPersonCheck,
} from "react-icons/bs";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  buscarEmpresa,
  formatearFecha,
  calcularEdad,
  calcularTiempo,
  iniciarPeriodo,
  finalizarPeriodo,
} from "../../functions/dataFunctions";
import { altaBaja, modificar } from "../../functions/dbFunctions";
import { agregarEvento } from "../../functions/eventFunctions";
import TablaEventosReducida from "../tablas/TablaEventosReducida";
import FormPersona from "../forms/FormPersona";
import FichaEventosGestor from "../fichas/FichaEventosGestor";
import LogoEmpresa from "../logos/LogoEmpresa";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";
import "./css/Fichas.css";

const FichaPersonal = ({ elemento, onClose, onGuardar }) => {
  const persona = elemento;
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {
    rol: "",
  };

  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const [panelAdminVisible, setPanelAdminVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("usuario"));

  const { empresas } = useData();

  useEffect(() => {
    const activarPanelOculto = () => {
      if (user.rol === "dev" || user.rol === "superadmin")
        setPanelAdminVisible(true);
    };

    activarPanelOculto();
  });
  if (!persona) return null;

  const fechaNacimiento = formatearFecha(persona.nacimiento);
  const fechaIngreso = formatearFecha(persona.ingreso);
  const edad = calcularEdad(persona.nacimiento);

  const handleBaja = () => {
    if (usuario.rol === "superadmin") {
      Swal.fire({
        title: `BAJA ${persona.puesto}`,
        text: `${persona.apellido}, ${persona.nombres}`,
        icon: "warning",
        input: "text",
        inputPlaceholder: "Motivo de la baja",
        showCancelButton: true,
        confirmButtonText: "CONFIRMAR",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const motivo = result.value?.trim() || "Sin motivo";
          const datosBaja = {
            fecha: new Date(),
            tipo: "baja",
            persona: persona.id,
            detalle: motivo,
          };
          try {
            await finalizarPeriodo(persona.id, persona.empresa, new Date());
            await altaBaja("personas", persona.id, false);
            elemento.estado = false;
            elemento.empresa = null;
            await agregarEvento(datosBaja, "administracion");
            await modificar("personas", persona.id, { estado: false });
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
          onClose();
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

  const handleAlta = () => {
    if (usuario.rol === "superadmin") {
      const empresasPropias = empresas.filter((e) => e.tipo === "propia");
      const empresasOptions = {};
      empresasPropias.forEach((e) => {
        empresasOptions[e.id] = e.nombre;
      });

      Swal.fire({
        title: `ALTA ${persona.puesto}`,
        text: `${persona.apellido}, ${persona.nombres}`,
        icon: "question",
        input: "select",
        inputOptions: empresasOptions,
        inputPlaceholder: "Seleccionar una empresa",
        showCancelButton: true,
        confirmButtonText: "CONFIRMAR",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const datosAlta = {
            fecha: new Date(),
            tipo: "alta",
            persona: persona.id,
            empresa: result.value,
          };
          try {
            await altaBaja("personas", persona.id, datosAlta.empresa, true);
            elemento.estado = true;
            await agregarEvento(datosAlta, "administracion");
            await iniciarPeriodo(persona.id, datosAlta);
          } catch (error) {
            console.error("Error al registrar alta:", error);
            Swal.fire({
              title: "Error",
              text: "No se pudo completar el alta.",
              icon: "error",
              confirmButtonText: "Entendido",
              confirmButtonColor: "#4161bd",
            });
          }
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

  const handleGuardado = async (personaModificada) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(personaModificada);
  };

  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}>
              ✕
            </button>

            <h1 className="person-name">
              <strong className="apellido">{persona.apellido}</strong>
              <span className="nombres"> {persona.nombres} </span>
            </h1>

            <hr />
            <div className="info-subname">
              <p className="info-minitext">{edad ? edad + " años" : null}</p>
              {persona.estado ? (
                <p className="info-minitext stateBox" onClick={handleBaja}>
                  activo <LogoPersonCheck className="logoestado logo-active" />
                </p>
              ) : (
                <p className="info-minitext stateBox" onClick={handleAlta}>
                  innactivo{" "}
                  <LogoPersonDash className="logoestado logo-disabled" />
                </p>
              )}
            </div>

            <p className="ficha-info-title">
              <strong>Información Personal</strong>{" "}
            </p>
            <div className="ficha-info container">
              <div className="row">
                <p className="ficha-info-item">
                  <strong>Nro DNI </strong>
                  <span className="ficha-info-item-txt">
                    {persona.dni || persona.id}
                  </span>
                </p>
                <p className="ficha-info-item">
                  <strong>Fecha nac.</strong>
                  <span className="ficha-info-item-txt">{fechaNacimiento}</span>
                  {edad && (
                    <span className="ficha-info-item-txt2">{edad} años</span>
                  )}
                </p>
                <p className="ficha-info-item">
                  <strong>Ubicación</strong>
                  <span className="ficha-info-item-txt">
                    {persona.ubicacion}
                  </span>
                </p>
              </div>
            </div>

            <p className="ficha-info-title">
              <strong>Información laboral</strong>
              {panelAdminVisible && persona.alerta ? (
                <span
                  className={`ficha-info-alert ${
                    persona.alerta === "NO RETOMAR"
                      ? "alert-red"
                      : persona.alerta === "RETOMAR"
                      ? "alert-green"
                      : ""
                  }`}
                >
                  {persona.alerta}
                </span>
              ) : null}
            </p>
            <div className="ficha-info container">
              <div className="row">
                <div className="col-md-9">
                  <p className="ficha-info-item">
                    <strong>Empresa</strong>
                    <span className="ficha-info-item-txt">
                      {buscarEmpresa(empresas, persona.empresa)}
                    </span>
                  </p>
                  <p className="ficha-info-item">
                    <strong>Ingreso</strong>
                    <span className="ficha-info-item-txt">{fechaIngreso}</span>
                  </p>
                  <p className="ficha-info-item">
                    <strong>Puesto</strong>
                    <span className="ficha-info-item-txt">
                      {persona.puesto}
                    </span>
                  </p>
                  <p className="ficha-info-item">
                    <strong>Sucursal</strong>
                    <span className="ficha-info-item-txt">
                      {persona.sucursal}
                    </span>
                  </p>
                </div>
                <div className="col-md-3 col-img">
                  <LogoEmpresa cuitEmpresa={persona.empresa} />
                </div>
              </div>
            </div>

            {persona.detalle && (
              <>
                <p className="ficha-info-title">
                  <strong>Detalle</strong>
                </p>
                <div className="ficha-info">
                  <p>{persona.detalle}</p>
                </div>
              </>
            )}

            {panelAdminVisible && (
              <div className="panel-superadmin">
                <h2 className="form-info-title2">administración</h2>
                <br />
                <p className="ficha-info-title">
                  <strong>Periodos contratado</strong>
                  {persona.periodos && persona.periodos.length > 0 && (
                    <span className="list-cant2">
                      {persona.periodos.length} periodo
                      {persona.periodos.length !== 1 && "s"}
                    </span>
                  )}
                </p>
                <div className="ficha-info-box special">
                  {persona.periodos
                    ?.slice()
                    .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
                    .map((p, index) => {
                      const inicio = formatearFecha(p.inicio);
                      const fin = p.fin ? formatearFecha(p.fin) : "Actualidad";
                      const duracion = calcularTiempo(p.inicio, p.fin);

                      return (
                        <div key={index} className="special-item">
                          <div className="special-header">
                            <span className="list-cant">{index + 1}</span>
                            <span className="special-fechas">
                              {inicio} – {fin}{" "}
                              <span className="special-duracion">
                                ({duracion})
                              </span>
                            </span>
                          </div>

                          <div className="special-body">
                            <p className="special-detalle">
                              {p.detalle || "Sin detalle"}
                            </p>
                            <div className="special-logo">
                              <LogoEmpresaTxt
                                cuitEmpresa={p.empresa}
                                completo={false}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                {persona.comentario && (
                  <>
                    <p className="ficha-info-title">
                      <strong>Comentarios</strong>
                    </p>
                    <div className="ficha-info">
                      <p>{persona.comentario}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            <TablaEventosReducida
              tipoColeccion="persona"
              identificador={persona.dni}
              onRowClick={(evento) => {
                setEventoSeleccionado(evento);
                setModalFichaVisible(true);
              }}
            />
            {modalFichaVisible && (
              <FichaEventosGestor
                tipo={
                  eventoSeleccionado.tipo === "DEJA" ||
                  eventoSeleccionado.tipo === "RETIRA" ||
                  eventoSeleccionado.tipo === "ENTREGA"
                    ? "llave"
                    : eventoSeleccionado.tipo
                }
                elemento={eventoSeleccionado}
                onClose={() => setModalFichaVisible(false)}
                onGuardar={onGuardar}
              />
            )}
            {onGuardar && (
              <div className="ficha-buttons">
                <button onClick={() => setModoEdicion(true)}>Editar</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <FormPersona
          tipoPuesto={persona.puesto}
          persona={persona}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaPersonal;

import { useState } from "react";
import { BsPersonDash, BsPersonCheck } from "react-icons/bs";
import Swal from "sweetalert2";

import { useData } from "../../context/DataContext";
import {
  buscarEmpresa,
  formatearFecha,
  calcularEdad,
} from "../../functions/dataFunctions";
import { altaBaja } from "../../functions/dbFunctions";
import { agregarEvento } from "../../functions/eventFunctions";

import TablaEventosReducida from "../tablas/TablaEventosReducida";
import FormPersona from "../forms/FormPersona";
import FichaEventosGestor from "../fichas/FichaEventosGestor";
import LogoEmpresa from "../logos/LogoEmpresa";

import "./css/Fichas.css";

const FichaPersonal = ({ elemento, onClose, onGuardar }) => {
  const persona = elemento;
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);

  const { empresas } = useData();

  if (!persona) return null;

  const fechaNacimiento = formatearFecha(persona.nacimiento);
  const fechaIngreso = formatearFecha(persona.ingreso);
  const edad = calcularEdad(persona.nacimiento);

  const handleBaja = () => {
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
        await altaBaja("personas", persona.id, false);
        elemento.estado = false;
        elemento.empresa = null;
        await agregarEvento(datosBaja, "administracion");
      }
    });
  };

  const handleAlta = () => {
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
        await altaBaja("personas", persona.id, datosAlta.empresa, true);
        elemento.estado = true;
        await agregarEvento(datosAlta, "administracion");
      }
    });
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
                  activo <BsPersonCheck className="logoestado logo-active" />
                </p>
              ) : (
                <p className="info-minitext stateBox" onClick={handleAlta}>
                  innactivo{" "}
                  <BsPersonDash className="logoestado logo-disabled" />
                </p>
              )}
            </div>

            <p className="ficha-info-title">
              <strong>Información Personal</strong>
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

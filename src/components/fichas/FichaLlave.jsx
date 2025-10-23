// ----------------------------------------------------------------------- imports externos
import { useEffect, useState } from "react";
import { FaKey as LogoKey } from "react-icons/fa";
import { TbChecklist as LogoCheck } from "react-icons/tb";
// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import FormGestor from "../forms/FormGestor";
import {
  formatearFecha,
  formatearHora,
  buscarPersona,
  buscarEmpresa,
} from "../../functions/dataFunctions";
import "./css/Fichas.css";
import TextButton from "../buttons/TextButton";

const FichaLlave = ({ elemento, onClose, onGuardar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tractoresNombres, setTractoresNombres] = useState([]);
  const [modificaciones, setModificaciones] = useState([]);

  const { personas, empresas, tractores } = useData();
  const fechaFormateada = formatearFecha(elemento?.fecha);
  const horaFormateada = formatearHora(elemento?.fecha);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!elemento) return;

      // Modificaciones
      let modificacionesArray = [];
      if (
        elemento.modificaciones !== undefined &&
        elemento.modificaciones !== null
      ) {
        modificacionesArray = Array.isArray(elemento.modificaciones)
          ? elemento.modificaciones
          : [elemento.modificaciones];
      }

      setModificaciones(modificacionesArray);

      // Tractores (normalizamos a array aunque venga un solo valor)
      let tractoresArray = [];
      if (elemento.tractor !== undefined && elemento.tractor !== null) {
        tractoresArray = Array.isArray(elemento.tractor)
          ? elemento.tractor
          : [elemento.tractor]; // si es un solo valor, lo convertimos a array
      }

      if (tractoresArray.length > 0) {
        const nombresTractores = tractoresArray
          .map((int) => {
            const t = tractores.find(
              (tr) => Number(tr.interno) === Number(int)
            );
            return t ? `${t.dominio} (${t.interno})` : null;
          })
          .filter(Boolean);
        setTractoresNombres(nombresTractores);
      }
    };

    cargarDatos();
  }, [elemento]);

  if (!elemento) return null;

  const handleGuardado = async (eventoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(eventoModificado);
  };

  const onCloseFormEdit = () => {
    setModoEdicion(false);
  };

  return (
    <>
      {!modoEdicion ? (
        <div className="ficha">
          <div className="ficha-content">
            <button className="ficha-close" onClick={onClose}>
              ✕
            </button>
            <h1 className="event-subtipo">
              {elemento.id ? elemento.id : "REGISTRO DE LLAVES"}
            </h1>
            <hr />
            <div className="hora">
              <span>{fechaFormateada}</span>
              <span>{horaFormateada} HS</span>
            </div>
            <div className="ficha-info">
              <p className="ficha-type">
                <strong>
                  {elemento.tipo === "RETIRA" ? (
                    <>
                      <LogoKey className="ficha-type-logo" /> RETIRA LLAVES
                    </>
                  ) : elemento.tipo === "ENTREGA" ||
                    elemento.tipo === "DEJA" ? (
                    <>
                      <LogoKey className="ficha-type-logo" />
                      ENTREGA LLAVES
                    </>
                  ) : elemento.tipo === "INVENTARIO" ? (
                    <>
                      <LogoCheck className="ficha-type-logo" />
                      INVENTARIO DE LLAVES
                    </>
                  ) : null}
                </strong>
              </p>
              {elemento.persona ? (
                <>
                  <p>
                    <strong>Persona: </strong>{" "}
                    {buscarPersona(personas, elemento.persona)}
                  </p>
                </>
              ) : null}
              {elemento.servicio ? (
                <>
                  <p>
                    <strong>Servicio: </strong>{" "}
                    {buscarEmpresa(empresas, elemento.servicio)}
                  </p>
                </>
              ) : null}
              <p>
                <strong>Operador: </strong>{" "}
                {buscarPersona(personas, elemento.operador)}
              </p>
              <p>
                <strong>Tractor: </strong>{" "}
                {tractoresNombres.length > 0
                  ? tractoresNombres.join(", ")
                  : "SIN ASIGNAR"}
                {elemento.parteTr ? (
                  <>
                    <span className="infobox blackbox">DEJÓ PARTE</span>{" "}
                  </>
                ) : null}
              </p>
              <p>
                <strong>Detalle: </strong> {elemento.detalle || "-"}
              </p>
            </div>
            <div className="ficha-data">
              {elemento.usuario ? (
                <p>
                  Cargado por <strong>{elemento.usuario}</strong>
                </p>
              ) : (
                " "
              )}
            </div>
            {modificaciones.length > 0 && (
              <>
                <p className="ficha-info-title">
                  <strong>Modificaciones</strong>
                </p>
                <div className="ficha-info container">
                  {modificaciones.map((mod, index) => (
                    <p key={index} className="item-list">
                      <strong>{mod.usuario}</strong>
                      {" ("}
                      {formatearFecha(mod.fecha)} {formatearHora(mod.fecha)}
                      {" hs)"}
                    </p>
                  ))}
                </div>
              </>
            )}

            <div className="ficha-buttons">
              <TextButton
                text="Editar"
                type="submit"
                onClick={() => setModoEdicion(true)}
              />
            </div>
          </div>
        </div>
      ) : (
        <FormGestor
          tipo="llave"
          filtroSector={elemento.area}
          elemento={elemento}
          onClose={onCloseFormEdit}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaLlave;

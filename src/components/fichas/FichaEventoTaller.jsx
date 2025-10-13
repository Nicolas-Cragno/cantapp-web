// ----------------------------------------------------------------------- imports externos
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useData } from "../../context/DataContext";
// ----------------------------------------------------------------------- imports internos
import { formatearFecha, formatearHora } from "../../functions/dataFunctions";

import {
  buscarPersona,
  buscarRepuestoPorID,
  abreviarUnidad,
} from "../../functions/dataFunctions";
import FormGestor from "../forms/FormGestor";

// ----------------------------------------------------------------------- visuales logos etc
import "./css/Fichas.css";

const FichaEventoTaller = ({
  elemento,
  tipoVehiculo = "Vehiculo",
  onClose,
  onGuardar,
}) => {
  const { tractores, furgones, personas, usoStock, stock } = useData();
  const evento = elemento;
  const AREA = elemento.area;
  const [modoEdicion, setModoEdicion] = useState(false);
  const [persona, setPersona] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [chofer, setChofer] = useState("");
  const [tractor, setTractor] = useState("SIN ASIGNAR");
  const [furgon, setFurgon] = useState("SIN ASIGNAR");
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fechaFormateada = formatearFecha(evento.fecha);
  const horaFormateada = formatearHora(evento.fecha);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!evento) return null;
      setLoading(true);
      try {
        const repuestosListado = evento.repuestos.map((r) => ({
          ...r,
          descripcion: r.descripcion || buscarRepuestoPorID(stock, r.id),
        }));
        setRepuestos(repuestosListado);

        if (evento.persona) {
          const nombrePersona = await buscarPersona(personas, evento.persona);
          setPersona(nombrePersona);
        }

        if (evento.chofer) {
          const nombreChofer = await buscarPersona(personas, evento.chofer);
          setChofer(nombreChofer);
        }

        if (evento.mecanico) {
          const nombreMecanico = await buscarPersona(personas, evento.mecanico);
          setMecanico(nombreMecanico);
        }

        if (evento.tractor) {
          const dTractor = tractores.find((t) => t.interno === evento.tractor);
          if (dTractor) {
            setTractor(`${dTractor.dominio} (${dTractor.interno})`);
          }
        }

        if (evento.furgon) {
          const dFurgon = furgones.find((f) => f.interno === evento.furgon);
          if (dFurgon) {
            setFurgon(`${dFurgon.dominio} (${dFurgon.interno})`);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [evento]);

  if (!evento) return null;

  const handleGuardado = async (eventoModificado) => {
    setModoEdicion(false);
    if (onGuardar) await onGuardar(eventoModificado);
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
              {evento.area ? "TALLER " + evento.area.toUpperCase() : "TALLER"}
            </h1>
            <hr />
            <div className="hora">
              <span>{fechaFormateada}</span>
              <span>{horaFormateada} HS</span>
            </div>
            <div className="ficha-info">
              <p>
                <strong>Mecanico: </strong> {mecanico}
              </p>

              {tipoVehiculo === "tractores" ? (
                <p>
                  <strong>Tractor: </strong> {tractor}
                </p>
              ) : tipoVehiculo === "furgones" ? (
                <p>
                  <strong>Furgón: </strong>
                  {furgon}
                </p>
              ) : null}

              {chofer ? (
                <p>
                  <strong>Chofer: </strong>
                  {chofer}
                </p>
              ) : null}
            </div>
            {repuestos.length > 0 && (
              <>
                <p className="ficha-info-title">
                  <strong>Repuesto/s</strong>
                </p>
                <div className="ficha-info">
                  {loading ? (
                    <div className="loading-item">
                      <FaSpinner className="spinner" />
                    </div>
                  ) : (
                    repuestos.map((r, id) => (
                      <p key={id} className="ficha-itemlist">
                        <strong>{r.id}</strong> - {r.descripcion}{" "}
                        <span className="cant-detail">
                          {r.cantidad} {abreviarUnidad(r.unidad)}
                        </span>
                      </p>
                    ))
                  )}
                </div>
              </>
            )}
            <p className="ficha-info-title">
              <strong>Detalle</strong>
            </p>
            <div className="ficha-info">
              <p>
                <strong>Detalle: </strong> {evento.detalle || "-"}
              </p>
            </div>
            <div className="ficha-data">
              {evento.usuario ? (
                <p>
                  Cargado por <strong>{evento.usuario}</strong>{" "}
                </p>
              ) : (
                " "
              )}
            </div>
            <div className="ficha-buttons">
              <button onClick={() => setModoEdicion(true)}>Editar</button>
            </div>
          </div>
        </div>
      ) : (
        <FormGestor
          tipo={AREA}
          elemento={elemento}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaEventoTaller;

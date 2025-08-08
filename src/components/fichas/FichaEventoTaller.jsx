import "../css/Fichas.css";
import { FaSpinner } from "react-icons/fa";
import { formatearFecha, formatearHora } from "../../functions/data-functions";
import { useEffect, useState } from "react";
import FormularioEventoTaller from "../forms/FormularioEventoTaller";
import {
  buscarNombrePorDni,
  listarColeccion,
  buscarRepuestoPorID,
} from "../../functions/db-functions";

const FichaEventoTaller = ({
  evento,
  tipoVehiculo = "Vehiculo",
  onClose,
  onGuardar,
}) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState("SIN ASIGNAR");
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
        const datos = await listarColeccion("usoStock");

        const repuestosFiltrados = datos.filter(
          (r) => evento.id === r.reparacion
        );
        const repuestosDetallados = await Promise.all(
          repuestosFiltrados.map(async (r) => {
            const descripcionCompleta = await buscarRepuestoPorID(
              evento.repuesto
            );
            return {
              ...r,
              descripcion: descripcionCompleta,
            };
          })
        );
        setRepuestos(repuestosDetallados);

        if (evento.persona) {
          const nombrePersona = await buscarNombrePorDni(evento.persona);
          setNombre(nombrePersona);
        }

        if (evento.tractor) {
          const tractores = await listarColeccion("tractores");
          const dTractor = tractores.find((t) => t.interno === evento.tractor);
          if (dTractor) {
            setTractor(`${dTractor.dominio} (${dTractor.interno})`);
          }
        }

        if (evento.furgon) {
          const furgones = await listarColeccion("furgones");
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
              {evento.area ? "TALLER " + evento.subarea : "TALLER"}
            </h1>
            <hr />
            <div className="hora">
              <span>{fechaFormateada}</span>
              <span>{horaFormateada} HS</span>
            </div>
            <div className="ficha-info">
              <p>
                <strong>Mecanico: </strong> {nombre}
              </p>
              <p>
                <strong>
                  {tipoVehiculo === "tractores"
                    ? "Tractor"
                    : tipoVehiculo === "furgones"
                    ? "Furgon"
                    : tipoVehiculo}
                  :{" "}
                </strong>
                {tractor}
              </p>
            </div>
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
                  <p key={id}>
                    <strong>{r.repuesto}</strong> - {r.descripcion}{" "}
                    <span className="cant-detail">
                      {r.cantidad} {r.unidad}
                    </span>
                  </p>
                ))
              )}
            </div>
            <p className="ficha-info-title">
              <strong>Detalle</strong>
              {evento.area} {evento.subarea}
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
        <FormularioEventoTaller
          evento={evento}
          onClose={() => setModoEdicion(false)}
          onGuardar={handleGuardado}
        />
      )}
    </>
  );
};

export default FichaEventoTaller;

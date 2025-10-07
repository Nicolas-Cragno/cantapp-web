// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
import Select from "react-select";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TextButton from "../buttons/TextButton";
import {
  formatearFecha,
  formatearFechaCorta,
} from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- estilos
import "./css/Modales.css";

const ModalTramos = ({ onClose, tramos, setTramos }) => {
  const { estaciones } = useData();
  const [nuevoTramo, setNuevoTramo] = useState({
    fecha: new Date(),
    litros: 0,
    lugar: "",
  });

  const BASE_SUR = "RIO GRANDE";
  const BASE_SUR2 = "USHUAIA";
  const BASE = "DON TORCUATO";

  const handleAgregarTramo = () => {
    if (!nuevoTramo.litros || !nuevoTramo.lugar) return;

    const fechaTransformada =
      typeof nuevoTramo.fecha === "string"
        ? (() => {
            const [year, month, day] = nuevoTramo.fecha.split("-").map(Number);
            return new Date(year, month - 1, day);
          })()
        : nuevoTramo.fecha;

    const tramoConId = {
      id: Date.now(),
      ...nuevoTramo,
      fecha: fechaTransformada,
    };

    setTramos([...tramos, tramoConId]);
    setNuevoTramo({ fecha: new Date(), litros: 0, lugar: "" });
  };

  const handleEliminarTramo = (idx) => {
    setTramos(tramos.filter((t) => t.id !== idx));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h2>Tramos del Viaje</h2>
          <hr />
        </div>

        {/* Formulario de nuevo tramo */}
        <div className="form-box2">
          <input
            type="date"
            value={nuevoTramo.fecha}
            onChange={(e) =>
              setNuevoTramo({ ...nuevoTramo, fecha: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Litros"
            value={nuevoTramo.litros}
            onChange={(e) => {
              const valor = e.target.value.replace(",", "."); // reemplaza coma por punto
              // permitimos solo números y punto
              if (/^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
                setNuevoTramo({
                  ...nuevoTramo,
                  litros: valor,
                });
              }
            }}
            onBlur={() =>
              setNuevoTramo({
                ...nuevoTramo,
                litros:
                  parseFloat(String(nuevoTramo.litros).replace(",", ".")) || 0,
              })
            }
          />

          <Select
            className="select-grow"
            options={estaciones
              .map((t) => ({
                value: t.id,
                label: `${t.localidad} (${t.provincia})`,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            value={
              nuevoTramo.lugar
                ? estaciones
                    .map((t) => ({
                      value: t.id,
                      label: `${t.localidad} (${t.provincia})`,
                    }))
                    .find((opt) => opt.value === nuevoTramo.lugar)
                : null
            }
            onChange={(opt) =>
              setNuevoTramo({ ...nuevoTramo, lugar: opt ? opt.value : "" })
            }
            placeholder="Lugar de carga"
          />
          <br />
          <TextButton
            text="+ Agregar tramo"
            mini={true}
            onClick={handleAgregarTramo}
          />
        </div>

        {/* Listado de tramos */}
        {tramos.length > 0 && (
          <div className="form-itemlist">
            {[...tramos]
              .sort((a, b) => a.fecha - b.fecha)
              .map((t) => {
                const localidad = estaciones.find(
                  (e) => e.id === t.lugar
                )?.localidad;
                let clase = "form-table-item";
                if (localidad === "RIO GRANDE") clase += " item-black";
                else if (localidad === "DON TORCUATO") clase += " item-blue";

                return (
                  <p key={t.id} className={clase}>
                    <span>{formatearFecha(t.fecha)}</span>
                    <span>
                      {localidad} (
                      {estaciones.find((e) => e.id === t.lugar)?.provincia})
                    </span>
                    <span>
                      <strong>{t.litros} lts</strong>
                    </span>
                    <span
                      className="delete-btn"
                      onClick={() => handleEliminarTramo(t.id)}
                    >
                      ✕
                    </span>
                  </p>
                );
              })}
          </div>
        )}

        <div className="modal-buttons">
          <TextButton text="Listo" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ModalTramos;

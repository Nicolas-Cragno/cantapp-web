// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

// ----------------------------------------------------------------------- imports internos
import { modificar } from "../../functions/dbFunctions";
import { useData } from "../../context/DataContext";
import {
  formatearFecha,
  formatearFechaCorta,
} from "../../functions/dataFunctions";
import InputValidator from "../devs/InputValidator";
import tiposEventos from "../../functions/data/eventos.json";
import TextButton from "../buttons/TextButton";

import "./css/Forms.css";

const FormToDoList = ({
  tipoVehiculo,
  vehiculo = null,
  onClose,
  onGuardar,
}) => {
  const [pendientes, setPendientes] = useState([]);
  const [nuevoPendiente, setNuevoPendiente] = useState({
    tipo: "",
    detalle: "",
  });
  const { tractores, furgones, vehiculos } = useData();
  const [pendienteEditando, setPendienteEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const subtiposDisponibles = tiposEventos[tipoVehiculo.toUpperCase()];

  const title =
    tipoVehiculo === "tractores"
      ? `TRACTOR ${vehiculo.id}`
      : tipoVehiculo === "furgones"
      ? `FURGÓN ${vehiculo.id}`
      : vehiculo.dominio;

  useEffect(() => {
    setPendientes(vehiculo.pendientes || []);
  }, [vehiculo.pendientes]);

  const agregarPendiente = () => {
    if (!nuevoPendiente.tipo || !nuevoPendiente.detalle.trim()) return;

    const maxId =
      pendientes.length > 0
        ? Math.max(...pendientes.map((p) => Number(p.id)))
        : 0;

    const nuevo = {
      id: maxId + 1,
      tipo: nuevoPendiente.tipo,
      detalle: nuevoPendiente.detalle.trim(),
      fecha: formatearFecha(new Date()),
    };

    setPendientes([...pendientes, nuevo]);
    setNuevoPendiente({ tipo: "", detalle: "" });
  };

  const eliminarPendiente = (id) => {
    setPendientes(pendientes.filter((p) => p.id !== id));
  };
  const comenzarEdicion = (pend) => {
    setPendienteEditando({ ...pend });
  };
  const guardarEdicion = () => {
    setPendientes(
      pendientes.map((p) =>
        p.id === pendienteEditando.id ? pendienteEditando : p
      )
    );
    setPendienteEditando(null);
  };
  const cancelarEdicion = () => {
    setPendienteEditando(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await modificar(tipoVehiculo, vehiculo.id, {
        ...vehiculo,
        pendientes,
      });

      if (onGuardar) onGuardar();

      Swal.fire({
        title: "Guardado",
        text: "Los pendientes fueron actualizados.",
        icon: "success",
        confirmButtonColor: "#4161bd",
      });
    } catch (error) {
      console.error("Error al guardar vehículo: ", error);
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonColor: "#4161bd",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{title}</h2>

        <form onSubmit={handleSubmit}>
          <p className="form-info-title">
            <strong>PROGRAMAR NUEVO PENDIENTE</strong>
          </p>

          <div className="form-info-box">
            <label>
              Tipo * <InputValidator campo={nuevoPendiente.tipo} />
              <Select
                options={subtiposDisponibles.map((sub) =>
                  typeof sub === "string"
                    ? { value: sub, label: sub }
                    : { value: sub.tipo, label: sub.tipo }
                )}
                value={
                  nuevoPendiente.tipo
                    ? {
                        value: nuevoPendiente.tipo,
                        label: nuevoPendiente.tipo,
                      }
                    : null
                }
                onChange={(opt) =>
                  setNuevoPendiente({
                    ...nuevoPendiente,
                    tipo: opt ? opt.value : "",
                  })
                }
                placeholder=""
                isClearable
              />
            </label>

            <label>
              Detalle <InputValidator campo={nuevoPendiente.detalle} />
              <textarea
                value={nuevoPendiente.detalle}
                onChange={(e) =>
                  setNuevoPendiente({
                    ...nuevoPendiente,
                    detalle: e.target.value,
                  })
                }
              />
            </label>

            <TextButton
              text="Agregar"
              className="mini-btn"
              type="button"
              onClick={agregarPendiente}
            />
          </div>

          <>
            {pendientes.length > 0 && (
              <>
                <p className="form-info-title">
                  <strong>PENDIENTES</strong>
                </p>

                <div className="form-info-box">
                  <ul className="pendientes-lista">
                    {pendientes.map((pend) => (
                      <p key={pend.id} className="item-list">
                        <span>
                          <strong className="item-blue2">{pend.tipo}</strong>{" "}
                          {pend.detalle}
                        </span>
                        <span className="cant-detail">
                          {formatearFechaCorta(pend.fecha)}
                        </span>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => eliminarPendiente(pend.id)}
                        >
                          ✕
                        </button>
                      </p>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>

            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormToDoList;

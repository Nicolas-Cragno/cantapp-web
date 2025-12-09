// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { agregar, modificar } from "../../functions/dbFunctions";
import { verificarDuplicado } from "../../functions/dataFunctions";
import InputValidator from "../devs/InputValidator";
import tiposEventos from "../../functions/data/eventos.json";

import "./css/Forms.css";
import TextButton from "../buttons/TextButton";

const FormVehiculo = ({
  tipoVehiculo,
  vehiculo = null,
  onClose,
  onGuardar,
}) => {
  const tipo =
    typeof tipoVehiculo === "string"
      ? tipoVehiculo
      : tipoVehiculo?.value || "tractores";

  const { tractores, furgones } = useData();
  const modoEdicion = !!vehiculo;
  const tipoDefault = tipoVehiculo ? tipoVehiculo : "tractores";
  const [bloquearSwitch, setBloquearSwitch] = useState(
    tipoVehiculo !== null || tipoVehiculo !== "" ? false : true
  );
  const [formData, setFormData] = useState({
    interno: vehiculo?.iterno || "",
    dominio: vehiculo?.dominio || "",
    pendientes: vehiculo?.pendientes || [],
  });
  const [interno, setInterno] = useState("");
  const [dominio, setDominio] = useState("");
  const [tractor, setTractor] = useState("");
  const [furgon, setFurgon] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(tipoDefault);
  const subtiposDisponibles = tiposEventos[tipoSeleccionado.toUpperCase()];
  const [pendientes, setPendientes] = useState([]);
  const [nuevoPendiente, setNuevoPendiente] = useState({
    tipo: "",
    detalle: "",
  });

  useEffect(() => {
    if (modoEdicion && vehiculo) {
      setInterno(vehiculo.interno ? String(vehiculo.interno) : "");
      setDominio(vehiculo.dominio || "");

      setPendientes(vehiculo.pendientes || []);
    }
  }, [modoEdicion, vehiculo]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tipoVehiculo !== "vehiculos") {
      if (!String(interno.trim()) || !String(dominio.trim())) {
        Swal.fire({
          title: "Faltan datos",
          text: "Complete los campos obligatorios.",
          icon: "question",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#4161bd",
        });
        return;
      }
    } else {
      if (!String(dominio.trim())) {
        Swal.fire({
          title: "Faltan datos",
          text: "Complete los campos obligatorios.",
          icon: "question",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#4161bd",
        });
        return;
      }
    }

    setLoading(true);

    const vehiculoData = {
      interno:
        tipoSeleccionado !== "vehiculo"
          ? String(interno).trim()
          : dominio.toUpperCase(),
      dominio: dominio.toUpperCase().trim(),
    };

    try {
      const identificador =
        tipoSeleccionado === "vehiculos" ? dominio.toUpperCase() : interno;

      if (modoEdicion) {
        await modificar(
          tipoVehiculo.toLowerCase(),
          identificador,
          vehiculoData
        );
        if (onGuardar) onGuardar(vehiculoData);
      } else {
        const lista =
          tipo === "tractores"
            ? tractores
            : tipo === "furgones"
            ? furgones
            : "";
        const existeInterno = await verificarDuplicado(lista, identificador);
        if (existeInterno) {
          Swal.fire({
            title: "Duplicado",
            text: `El interno o patente ${identificador} ya se encuentra registrado.`,
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4161bd",
          });
          setLoading(false);
          return;
        }

        const vehiculoAgregado = await agregar(
          tipoSeleccionado.toLowerCase(),
          vehiculoData,
          identificador
        );
        if (onGuardar) onGuardar(vehiculoAgregado);
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar vehículo: ", error);
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
    } finally {
      setLoading(false);
    }
  };
  const agregarPendiente = () => {
    if (!nuevoPendiente.tipo.trim() || !nuevoPendiente.detalle.trim()) return;

    setPendientes([...pendientes, nuevoPendiente]);
    setNuevoPendiente({ tipo: "", detalle: "" });
  };
  const eliminarPendiente = (index) => {
    setPendientes(pendientes.filter((_, i) => i !== index));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="form">
      <div className="form-content">
        <h2>
          {vehiculo
            ? `PENDIENTES ${vehiculo.tipo} ${vehiculo.id}`
            : "PROGRAMAR"}
        </h2>
        {!bloquearSwitch ? (
          <>
            <div className="type-container-small">
              <InputValidator campo={tipoSeleccionado} />
              <button
                type="button"
                className={
                  tipoSeleccionado === "tractores"
                    ? "type-btn positive-active-black"
                    : "type-btn"
                }
                onClick={() => {
                  setTipoSeleccionado("tractores");
                  setFurgon("");
                }}
              >
                TRACTOR {tipoSeleccionado === "tractores" ? " *" : null}{" "}
              </button>
              <button
                type="button"
                className={
                  tipoSeleccionado === "furgones"
                    ? "type-btn positive-active-black"
                    : "type-btn"
                }
                onClick={() => setTipoSeleccionado("furgones")}
              >
                FURGON {tipoSeleccionado === "furgones" ? " *" : null}{" "}
              </button>
            </div>
          </>
        ) : null}
        <form onSubmit={handleSubmit}>
          {tipoSeleccionado === "tractores" && (
            <>
              <label>
                Tractor * <InputValidator campo={tipoSeleccionado} />
                <div className="select-with-button">
                  <Select
                    className="select-grow"
                    options={tractores
                      .map((t) => ({
                        value: t.interno,
                        label: `${t.dominio} (${t.interno})`,
                        int: t.interno,
                      }))
                      .sort((a, b) => a.int - b.int)}
                    value={
                      formData.tractor
                        ? {
                            value: formData.tractor,
                            label:
                              tractores.find(
                                (t) => t.interno === formData.tractor
                              )?.dominio + ` (${formData.tractor})`,
                          }
                        : null
                    }
                    onChange={(opt) =>
                      setFormData({
                        ...formData,
                        tractor: opt ? opt.value : "",
                      })
                    }
                    placeholder=""
                    isClearable
                  />
                  {/*
                    <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickTractor}
                  />
                    */}
                </div>
              </label>
            </>
          )}
          {tipoSeleccionado === "furgones" && (
            <>
              <label>
                Furgon *
                <div className="select-with-button">
                  <Select
                    className="select-grow"
                    options={furgones
                      .map((f) => ({
                        value: f.interno,
                        label: `${f.dominio} (${f.interno})`,
                        int: f.interno,
                      }))
                      .sort((a, b) => a.int - b.int)}
                    value={
                      formData.furgon
                        ? {
                            value: formData.furgon,
                            label:
                              furgones.find(
                                (f) => f.interno === formData.furgon
                              )?.dominio + ` (${formData.furgon})`,
                          }
                        : null
                    }
                    onChange={(opt) =>
                      setFormData({
                        ...formData,
                        furgon: opt ? opt.value : "",
                      })
                    }
                    placeholder=""
                    isClearable
                  />
                  {/*
                    <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickTractor}
                  />
                    */}
                </div>
              </label>
            </>
          )}

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
                    ? { value: nuevoPendiente.tipo, label: nuevoPendiente.tipo }
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
                required
              />
            </label>

            <label>
              Detalle <InputValidator campo={nuevoPendiente.detalle} />
              <textarea
                name="detalle"
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
              onClick={agregarPendiente}
            />
          </div>
          {pendientes.length > 0 && (
            <>
              <p className="form-info-title">
                <strong>PENDIENTES</strong>
              </p>
              <div className="form-info-box">
                <ul className="pendientes-lista">
                  {pendientes.map((item, index) => (
                    <li key={index} className="list-item">
                      <div className="item-info">
                        <strong>{item.tipo}</strong>
                      </div>
                      <div className="item-info">{item.detalle}</div>

                      <div className="item-actions">
                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() => eliminarPendiente(index)}
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

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

export default FormVehiculo;

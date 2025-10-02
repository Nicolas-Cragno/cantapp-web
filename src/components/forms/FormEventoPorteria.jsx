// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { FaCheck as OkLogo } from "react-icons/fa";
import { GiCancel as XLogo } from "react-icons/gi";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { agregarEvento } from "../../functions/eventFunctions";
import { agregarItem, quitarItem } from "../../functions/stockFunctions";
import FormVehiculo from "./FormVehiculo";
import FormPersona from "./FormPersona";

// ----------------------------------------------------------------------- json e info
import chequeosPorteria from "../../functions/data/chequeosPorteria.json";
import tiposEventos from "../../functions/data/eventos.json";

// ----------------------------------------------------------------------- visuales, logos, etc
import TextButton from "../buttons/TextButton";
import "./css/Forms.css";

const FormEventoPorteria = ({ elemento = {}, onClose, onGuardar }) => {
  const SUCURSAL = "01";
  const area = "porteria";
  const { personas, tractores, furgones, vehiculos } = useData();
  const [tipoSeleccionado, setTipoSeleccionado] = useState("tractor");
  const [choferFletero, setChoferFletero] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);

  const [formData, setFormData] = useState({
    tipo: elemento.tipo || "",
    distincion: elemento.distincion || "tractor", // El ingreso puede ser de TRACTOR o PARTICULAR
    persona: elemento.persona ? String(elemento.persona) : "",
    operador: elemento.operador ? String(elemento.operador) : "",
    tractor: elemento.tractor || "",
    furgon: elemento.furgon || "",
    cargado: elemento.cargado || false,
    detalle: elemento.detalle || "",
    area: area,
    chequeos: chequeosPorteria.map(
      ({ key }) => elemento?.chequeos?.[key] || false
    ),
  });
  const subtiposDisponibles = area
    ? tiposEventos[area.toUpperCase()] || []
    : Object.entries(tiposEventos).flatMap(([nArea, subtipos]) =>
        subtipos.map((sub) => ({ nArea, subtipo: sub }))
      );
  const [furgonCargado, setFuegonCargado] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const cargarDatos = async () => {
      setFormData({
        tipo: elemento.tipo || "",
        distincion: elemento.distincion || "tractor",
        persona: elemento.persona ? String(elemento.persona) : "",
        operador: elemento.operador ? String(elemento.operador) : "",
        tractor: elemento.tractor || "",
        furgon: elemento.furgon || "",
        cargado: elemento.cargado || false,
        detalle: elemento.detalle || "",
        chequeos: chequeosPorteria.map(({ key }) => {
          const valor = elemento?.chequeos?.[key];
          return typeof valor === "boolean" ? valor : false;
        }),
      });
      setTipoSeleccionado(
        elemento.distincion ? elemento.distincion : "tractor"
      );
    };

    cargarDatos();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCarga = (state) => {
    if (state) {
      setFuegonCargado(true);
    } else {
      setFuegonCargado(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true); // para evitar doble carga/duplicados

    try {
      let fechaParaGuardar;
      if (elemento?.id && elemento.fecha) {
        fechaParaGuardar = elemento.fecha.toDate
          ? elemento.fecha.toDate()
          : new Date(elemento.fecha);
      } else {
        fechaParaGuardar = new Date();
      }

      /*
      if (isNaN(fechaParaGuardar.getTime())) {
        throw new Error("La fecha es inválida");
      }
     */

      const chequeosObjeto = chequeosPorteria.reduce(
        (checkList, item, index) => {
          checkList[item.key] = formData.chequeos[index] || false;
          return checkList;
        },
        {}
      );

      if (
        !formData.tipo ||
        !formData.persona ||
        !formData.operador ||
        (tipoSeleccionado === "tractor" && !formData.tractor)
      ) {
        Swal.fire({
          title: "Atención",
          text: "Debes seleccionar un tipo de evento antes de guardar.",
          icon: "warning",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#4161bd",
        });
        setUploading(false);
        return;
      }

      const datosAGuardar = {
        ...formData,
        fecha: fechaParaGuardar,
        tipo: formData.tipo || null,
        distincion: tipoSeleccionado, // por default TRACTOR
        persona: formData.persona ? Number(formData.persona) : null,
        operador: formData.operador ? Number(formData.operador) : null,
        area: area,
        detalle: formData.detalle ? formData.detalle.toUpperCase() : null,

        // CONDICIONADOS (TRACTOR O VEHICULO - CHOFER, PARTICULAR O FLETERO, ETC)
        tractor: formData.tractor ? Number(formData.tractor) : null,
        furgon: formData.furgon ? Number(formData.furgon) : null,
        vehiculo: formData.vehiculo ? String(formData.vehiculo) : null,
        cargado: furgonCargado,
        chequeos: chequeosObjeto,
      };

      await agregarEvento(datosAGuardar, area, elemento.id);
      if (datosAGuardar.tipo === "ENTRADA") {
        agregarItem(SUCURSAL, "tractores", datosAGuardar.tractor);
        if (datosAGuardar.furgon) {
          agregarItem(SUCURSAL, "furgones", datosAGuardar.furgon);
        }
      } else if (datosAGuardar.tipo === "SALIDA") {
        quitarItem(SUCURSAL, "tractores", datosAGuardar.tractor);
        if (datosAGuardar.furgon) {
          quitarItem(SUCURSAL, "furgones", datosAGuardar.furgon);
        }
      }

      if (onGuardar) onGuardar();
      Swal.fire({
        title: "Evento guardado",
        text: "Se ha completado el registro exitosamente.",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      console.error("Error al guardar evento:", error);
    }
  };
  const cerrarModalTractor = () => {
    setModalTractorVisible(false);
  };
  const handleClickTractor = async () => {
    setModalTractorVisible(true);
  };
  const handleClickFurgon = async () => {
    setModalFurgonVisible(true);
  };
  const handleClickVehiculo = async () => {
    setModalVehiculoVisible(true);
  };
  const handleClickPersona = async () => {
    setModalPersonaVisible(true);
  };
  const cerrarModalFurgon = () => {
    setModalFurgonVisible(false);
  };
  const cerrarModalVehiculo = () => {
    setModalVehiculoVisible(false);
  };
  const cerrarModalPersona = () => {
    setModalPersonaVisible(false);
  };

  return (
    <div className="form">
      <div className="form-content">
        <div className="form-header">
          <h2>{elemento.id ? elemento.id : "Nuevo Evento"}</h2>
          <p>* campo obligatorio</p>
          <hr />
        </div>
        {/* Tipo de ingreso /tractor/ /particular/ */}
        <div className="type-container-small">
          <button
            type="button"
            className={
              tipoSeleccionado === "tractor"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => setTipoSeleccionado("tractor")}
          >
            TRACTOR {tipoSeleccionado === "tractor" ? " *" : null}{" "}
          </button>
          <button
            type="button"
            className={
              tipoSeleccionado === "particular"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => setTipoSeleccionado("particular")}
          >
            PARTICULAR {tipoSeleccionado === "particular" ? " *" : null}{" "}
          </button>
        </div>
        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Tipo de evento /entrada/ /salida/ /inventario/ */}
          <label>
            Tipo *
            <Select
              options={subtiposDisponibles.map((sub) =>
                typeof sub === "string"
                  ? { value: sub, label: sub }
                  : { value: sub.tipo, label: sub.tipo }
              )}
              value={
                formData.tipo
                  ? { value: formData.tipo, label: formData.tipo }
                  : null
              }
              onChange={(opt) =>
                handleChange({
                  target: { name: "tipo", value: opt ? opt.value : "" },
                })
              }
              placeholder=""
              isClearable
              required
            />
          </label>
          {/* /operador/ que carga */}
          <label>
            Operador *
            <Select
              options={personas
                .filter(
                  (o) => o.puesto === "VIGILANCIA" || o.puesto === "SEGURIDAD"
                )
                .map((o) => ({
                  value: o.id,
                  label: `${o.apellido} ${o.nombres} (DNI: ${o.dni})`,
                  apellido: o.apellido,
                }))
                .sort((a, b) => a.apellido.localeCompare(b.apellido))}
              value={
                formData.operador
                  ? {
                      value: formData.operador,
                      label:
                        personas.find((p) => p.id === formData.operador)
                          ?.apellido +
                        " " +
                        personas.find((p) => p.id === formData.operador)
                          ?.nombres +
                        ` (DNI: ${formData.persona})`,
                    }
                  : null
              }
              onChange={(opt) =>
                setFormData({ ...formData, operador: opt ? opt.value : "" })
              }
              placeholder=""
              isClearable
              required
            />
          </label>
          <br />
          {/* Chofer o fletero */}
          {tipoSeleccionado === "tractor" && (
            <div className="type-container-small">
              <button
                type="button"
                className={
                  !choferFletero ? "type-btn positive-active-black" : "type-btn"
                }
                onClick={() => setChoferFletero(false)}
              >
                CHOFER {!choferFletero ? " *" : null}{" "}
              </button>
              <button
                type="button"
                className={
                  choferFletero ? "type-btn positive-active-black" : "type-btn"
                }
                onClick={() => setChoferFletero(true)}
              >
                FLETERO {choferFletero ? " *" : null}{" "}
              </button>
            </div>
          )}
          {/* /persona/ o /chofer/ */}
          <label>
            {" "}
            {tipoSeleccionado === "particular" ? "Persona *" : "Chofer *"}
            <div className="select-with-button">
              <Select
                className="select-grow"
                options={personas
                  .map((p) => ({
                    value: p.id,
                    label: `${p.apellido} ${p.nombres} (DNI: ${p.dni})`,
                    apellido: p.apellido, //para odenar
                  }))
                  .sort((a, b) => a.apellido.localeCompare(b.apellido))}
                value={
                  formData.persona
                    ? {
                        value: formData.persona,
                        label:
                          personas.find((p) => p.id === formData.persona)
                            ?.apellido +
                          " " +
                          personas.find((p) => p.id === formData.persona)
                            ?.nombres +
                          ` (DNI: ${formData.persona})`,
                      }
                    : null
                }
                onChange={(opt) =>
                  setFormData({ ...formData, persona: opt ? opt.value : "" })
                }
                placeholder=""
                isClearable
                required
              />
              <TextButton
                text="+"
                className="mini-btn"
                onClick={handleClickPersona}
              />
            </div>
          </label>

          {/* tipo vehiculo /tractor + furgon + chequeos/ o /vehiculo/ */}
          {tipoSeleccionado === "tractor" && !choferFletero ? (
            <>
              <label>
                Tractor *
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
                    required
                  />
                  <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickTractor}
                  />
                </div>
              </label>
            </>
          ) : (
            <>
              <label>
                Vehiculo
                <div className="select-with-button">
                  <Select
                    className="select-grow"
                    options={vehiculos.map((t) => ({
                      value: t.dominio,
                      label: `${t.dominio} (${t.marca})`,
                    }))}
                    value={
                      formData.vehiculo
                        ? {
                            value: formData.vehiculo,
                            label:
                              vehiculos.find(
                                (v) => v.dominio === formData.vehiculo
                              )?.dominio + ` (${formData.vehiculo})`,
                          }
                        : null
                    }
                    onChange={(opt) =>
                      setFormData({
                        ...formData,
                        vehiculo: opt ? opt.value : "",
                      })
                    }
                    placeholder=""
                    isClearable
                    // required  // Puede entrar SIN VEHICULO
                  />
                  <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickVehiculo}
                  />
                </div>
              </label>
            </>
          )}
          {tipoSeleccionado !== "particular" && (
            <>
              <label>
                Furgón
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
                  <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickFurgon}
                  />
                </div>
              </label>
              <div className="type-container">
                {formData.furgon && (
                  <>
                    <button
                      type="button"
                      className={
                        furgonCargado ? "type-btn positive-active" : "type-btn"
                      }
                      onClick={() => handleCarga(true)}
                    >
                      <XLogo className="check-logo" />
                      CARGADO
                    </button>
                    <button
                      type="button"
                      className={
                        !furgonCargado ? "type-btn negative-active" : "type-btn"
                      }
                      onClick={() => handleCarga(false)}
                    >
                      <OkLogo className="check-logo" />
                      VACIO
                    </button>{" "}
                  </>
                )}
              </div>
              <br />
            </>
          )}
          {tipoSeleccionado === "tractor" && !choferFletero && (
            <div>
              <label>Chequeos</label>
              <div className="checkbox-list">
                {chequeosPorteria.map((nombre, i) => (
                  <label
                    key={i}
                    className={`item-check ${
                      formData.chequeos[i] ? "activo" : "inactivo"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.chequeos[i]}
                      onChange={(e) => {
                        const nuevasMarcas = [...formData.chequeos];
                        nuevasMarcas[i] = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          chequeos: nuevasMarcas,
                        }));
                      }}
                    />
                    {nombre.label}
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* datalle */}
          <br />
          <label>
            Detalle
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
            />
          </label>

          <div className="form-buttons">
            <TextButton
              text={uploading ? "Guardando..." : "Guardar"}
              onClick={handleSubmit}
              type="submit"
              disabled={uploading}
            />
            <TextButton text="Cancelar" onClick={onClose} type="button" />
          </div>
        </form>
      </div>
      {modalTractorVisible && (
        <FormVehiculo
          tipoVehiculo={"tractores"}
          onClose={cerrarModalTractor}
          onGuardar={handleSubmit}
        />
      )}
      {modalFurgonVisible && (
        <FormVehiculo
          tipoVehiculo={"furgones"}
          onClose={cerrarModalFurgon}
          onGuardar={handleSubmit}
        />
      )}
      {modalVehiculoVisible && (
        <FormVehiculo
          tipoVehiculo={"vehiculos"}
          onClose={cerrarModalVehiculo}
          onGuardar={handleSubmit}
        />
      )}
      {modalPersonaVisible && (
        <FormPersona onClose={cerrarModalPersona} onGuardar={handleSubmit} />
      )}
    </div>
  );
};

export default FormEventoPorteria;

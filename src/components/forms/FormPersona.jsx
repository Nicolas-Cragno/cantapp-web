// ----------------------------------------------------------------------- imports externos
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { agregar, modificar } from "../../functions/dbFunctions";
import {
  buscarEmpresa,
  formatearFecha,
  calcularEdad,
  buscarCuitEmpresa,
  verificarDuplicado,
  formatearFechaInput,
} from "../../functions/dataFunctions";
import TextButton from "../buttons/TextButton";
import FormEmpresa from "./FormEmpresa";
import puestos from "../../functions/data/puestos.json";
import "./css/Forms.css";

const FormPersona = ({
  tipoPuesto = null,
  persona = null,
  onClose,
  onGuardar,
}) => {
  const { personas, empresas } = useData();
  const [panelAdminVisible, setPanelAdminVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("usuario"));
  const [activeIndex, setActiveIndex] = useState(null);
  const [esProveedor, setEsProveedor] = useState(false);
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);
  const [formData, setFormData] = useState({
    dni: persona?.dni || "",
    apellido: persona?.apellido?.toUpperCase() || "",
    nombres: persona?.nombres?.toUpperCase() || "",
    ubicacion: persona?.ubicacion?.toUpperCase() || "",
    edad: persona?.nacimiento ? calcularEdad(persona.nacimiento) : "",
    empresa: persona?.empresa ? buscarEmpresa(empresas, persona.empresa) : "",
    tipo: persona?.tipo || "",
    puesto: persona?.puesto || "",
    ingreso: persona?.ingreso ? formatearFechaInput(persona.ingreso) : "",
    legajo: persona?.legajo || "",
    sucursal: persona?.sucursal || "",
    estado: persona?.estado ? "Activo" : "Inactivo",
    detalle: persona?.detalle?.toUpperCase() || "",
    // super admin
    periodos:
      persona?.periodos?.map((p) => ({
        ...p,
        inicio: formatearFechaInput(p.inicio),
        fin: formatearFechaInput(p.fin),
      })) || [],
    comentario: persona?.comentario || "",
    alerta: persona?.alerta || "",
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (persona) setModoEdicion(true);
    const activarPanelOculto = () => {
      if (user.rol === "dev" || user.rol === "superadmin")
        setPanelAdminVisible(true);
    };

    activarPanelOculto();
  }, [persona]);

  const tiposDisponibles = [
    { value: "", label: "Seleccionar tipo..." },
    { value: "empleado", label: "EMPLEADO (TC - TA - EX)" },
    { value: "proveedor", label: "PROVEEDOR" },
  ];

  const handleClickNuevoProveedor = () => {
    setModalProveedorVisible(true);
  };

  const cerrarModalProveedor = () => {
    setModalProveedorVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleChangePeriodo = (index, campo, valor) => {
    setFormData((data) => {
      const nuevosPeriodos = [...data.periodos];
      nuevosPeriodos[index][campo] = valor;
      return { ...data, periodos: nuevosPeriodos };
    });
  };

  const handleActiveItem = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (modoEdicion) {
        const personaEditada = {
          ...formData,
          apellido: formData.apellido?.toUpperCase() || null,
          nombres: formData.nombres?.toUpperCase() || null,
          ubicacion: formData.ubicacion?.toUpperCase() || null,
          edad: formData.nacimiento ? calcularEdad(formData.nacimiento) : null,
          empresa: formData.empresa
            ? buscarCuitEmpresa(empresas, formData.empresa)
            : null,
          tipo: formData.tipo || null,
          puesto: formData.puesto || null,
          ingreso: formData.ingreso ? formatearFecha(formData.ingreso) : null,
          legajo: formData.legajo || null,
          sucursal: formData.sucursal || null,
          estado: formData.estado === "Activo",
          detalle: formData.detalle?.toUpperCase() || null,
          periodos: formData.periodos?.map((p) => ({
            inicio: p.inicio || null,
            fin: p.fin || null,
            empresa: p.empresa || null,
            detalle: p.detalle?.toUpperCase() || null,
          })),
          comentario: formData.comentario?.toUpperCase() || null,
          alerta: formData.alerta?.toUpperCase() || null,
        };

        await modificar("personas", personaEditada.dni, personaEditada);
        onGuardar?.(personaEditada);
      } else {
        if (verificarDuplicado(personas, formData.dni)) {
          Swal.fire({
            title: "Duplicado",
            text: "Ya existe una persona con ese DNI.",
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4161bd",
          });
          setUploading(false);
          return;
        }

        const nuevaPersona = {
          ...formData,
          dni: String(formData.dni),
          apellido: formData.apellido?.toUpperCase() || null,
          nombres: formData.nombres?.toUpperCase() || null,
          ubicacion: formData.ubicacion?.toUpperCase() || null,
          empresa: formData.empresa
            ? buscarCuitEmpresa(empresas, formData.empresa)
            : null,
          tipo: formData.tipo || null,
          puesto: formData.puesto || null,
          ingreso: new Date(),
          legajo: formData.legajo || null,
          sucursal: formData.sucursal || null,
          estado: true,
          detalle: formData.detalle?.toUpperCase() || null,
          // super admin
          periodos: [
            ...(formData.periodos || []), // mantiene los existentes si hubiera
            {
              inicio: new Date(), // fecha actual
              fin: null, // todavía no tiene fin
              empresa: formData.empresa
                ? buscarCuitEmpresa(empresas, formData.empresa)
                : null,
              detalle: null,
            },
          ],
          comentario: formData.comentario?.toUpperCase() || null,
          alerta: formData.alerta?.toUpperCase() || null,
        };

        await agregar("personas", nuevaPersona, String(nuevaPersona.dni));
        onGuardar?.(nuevaPersona);
      }
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
      console.error("Error al guardar persona:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{modoEdicion ? "Editar Persona" : "Nueva Persona"}</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <p className="ficha-info-title">
            <strong>Información personal</strong>
          </p>
          <div className="ficha-info">
            <label>DNI</label>
            <input
              type="number"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              min="1000000"
              max="99999999"
              disabled={modoEdicion}
              required
            />

            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              required
            />

            <label>Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
              required
            />
            <label>Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              style={{ textTransform: "uppercase" }}
            />
          </div>

          <p className="ficha-info-title">
            <strong>Información laboral</strong>
          </p>
          <div className="ficha-info">
            <label>Tipo</label>
            <Select
              name="tipo"
              value={
                tiposDisponibles.find((opt) => opt.value === formData.tipo) ||
                null
              }
              onChange={(selectedOpt) => {
                const value = selectedOpt ? selectedOpt.value : "";
                handleChange({
                  target: {
                    name: "tipo",
                    value,
                  },
                });

                setEsProveedor(value === "proveedor");

                if (value === "proveedor") {
                  handleChange({
                    target: { name: "puesto", value: "" },
                  });
                }
              }}
              options={tiposDisponibles}
              isDisabled={uploading}
              placeholder="Seleccionar tipo..."
            />

            <label>Empresa</label>

            <div className="select-with-button">
              <Select
                className="select-grow"
                name="empresa"
                value={
                  formData.empresa
                    ? {
                        value: formData.empresa,
                        label: formData.empresa.nombre,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  handleChange({
                    target: {
                      name: "empresa",
                      value: selectedOption ? selectedOption.value : "",
                    },
                  })
                }
                options={[
                  { value: null, label: "..." }, // opción para no elegir nada
                  ...empresas
                    .filter(
                      esProveedor
                        ? (e) => e.tipo === "proveedor"
                        : (e) => e.tipo === "propia"
                    )
                    .map((p) => ({ value: p, label: p.nombre })),
                ]}
                isDisabled={uploading}
                placeholder="Seleccionar empresa..."
              />
              {esProveedor && (
                <TextButton
                  text="+"
                  className="mini-btn"
                  onClick={esProveedor ? handleClickNuevoProveedor : null}
                  disabled={!esProveedor}
                />
              )}
            </div>

            <label>Puesto</label>
            <Select
              name="puesto"
              value={
                esProveedor
                  ? null
                  : formData.puesto
                  ? { value: formData.puesto, label: formData.puesto }
                  : null
              }
              onChange={(selectedOption) =>
                handleChange({
                  target: {
                    name: "puesto",
                    value: selectedOption ? selectedOption.value : "",
                  },
                })
              }
              options={puestos.map((p) => ({ value: p, label: p }))}
              isDisabled={uploading || esProveedor}
              placeholder="Seleccionar puesto..."
            />
          </div>

          <div className="form-group">
            <label>Detalle</label>

            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
            />
          </div>

          {panelAdminVisible && (
            <div className="panel-superadmin">
              <h2 className="form-info-title2">administración</h2>
              <br />
              {modoEdicion && (
                <>
                  <p className="ficha-info-title">
                    <strong>Períodos contratados</strong>
                    <span className="list-cant2">
                      {formData.periodos?.length} periodo
                      {formData.periodos?.length !== 1 && "s"}
                    </span>
                  </p>

                  <div className="form-info-box">
                    {formData.periodos
                      ?.slice()
                      .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
                      .map((p, index) => (
                        <>
                          <div
                            className={`form-special-item-header ${
                              activeIndex !== index ? "margin-bt" : ""
                            }`}
                            onClick={() => handleActiveItem(index)}
                          >
                            <h2 className="item-title">{index + 1}° periodo</h2>
                          </div>

                          <div
                            key={index}
                            className={
                              activeIndex === index
                                ? "form-special-item"
                                : "form-special-item-innactive"
                            }
                          >
                            <div
                              className="special-body"
                              style={{ flexDirection: "column", gap: "6px" }}
                            >
                              <label>
                                Inicio:
                                <input
                                  type="date"
                                  value={p.inicio}
                                  onChange={(e) =>
                                    handleChangePeriodo(
                                      index,
                                      "inicio",
                                      e.target.value
                                    )
                                  }
                                />
                              </label>

                              <label>
                                Fin:
                                <input
                                  type="date"
                                  value={p.fin || ""}
                                  onChange={(e) =>
                                    handleChangePeriodo(
                                      index,
                                      "fin",
                                      e.target.value
                                    )
                                  }
                                />
                              </label>

                              <label>
                                Empresa:
                                <select
                                  value={p.empresa || ""}
                                  onChange={(e) =>
                                    handleChangePeriodo(
                                      index,
                                      "empresa",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">
                                    Seleccionar empresa...
                                  </option>
                                  {empresas
                                    .filter((e) => e.tipo === "propia")
                                    .map((e) => (
                                      <option key={e.cuit} value={e.cuit}>
                                        {e.nombre}
                                      </option>
                                    ))}
                                </select>
                              </label>

                              <label>
                                Detalle:
                                <textarea
                                  type="text"
                                  placeholder="Detalle"
                                  value={p.detalle || ""}
                                  onChange={(e) =>
                                    handleChangePeriodo(
                                      index,
                                      "detalle",
                                      e.target.value
                                    )
                                  }
                                />
                              </label>

                              <button
                                className="form-delete"
                                onClick={() =>
                                  setFormData((data) => ({
                                    ...data,
                                    periodos: data.periodos.filter(
                                      (_, i) => i !== index
                                    ),
                                  }))
                                }
                              >
                                {" "}
                                ✕{" "}
                              </button>
                            </div>
                            <div className="form-buttons form-buttons-right">
                              {" "}
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                  <div className="form-buttons form-buttons-right">
                    <TextButton
                      text="+ Nuevo periodo"
                      className="mini-btn"
                      onClick={() =>
                        setFormData((data) => ({
                          ...data,
                          periodos: [
                            ...(data.periodos || []),
                            { inicio: "", fin: "", empresa: "", detalle: "" },
                          ],
                        }))
                      }
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Comentarios</label>
                <textarea
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                />
              </div>
              <div
                className={`form-info-alert ${
                  formData.alerta?.toUpperCase() === "NO RETOMAR"
                    ? "alert-red"
                    : formData.alerta?.toUpperCase() === "RETOMAR"
                    ? "alert-green"
                    : ""
                }`}
              >
                <label>Alerta</label>
                <input
                  type="text"
                  name="alerta"
                  value={formData.alerta}
                  onChange={handleChange}
                  style={{ textTransform: "uppercase" }}
                />
              </div>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" disabled={uploading}>
              {uploading ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={onClose} disabled={uploading}>
              Cancelar
            </button>
          </div>
        </form>
        {modalProveedorVisible && (
          <FormEmpresa onClose={cerrarModalProveedor} onGuardar={onGuardar} />
        )}
      </div>
    </div>
  );
};

export default FormPersona;

// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { agregar, modificar } from "../../functions/dbFunctions";
import { codigoStock } from "../../functions/dataFunctions";
import FormProveedor from "./FormProveedor";
import TextButton from "../buttons/TextButton";
import Codigos from "../../functions/data/articulos.json";
import "./css/Forms.css";

const FormStock = ({ articulo = null, onClose, onGuardar }) => {
  const [loading, setLoading] = useState(false);
  const { stock, proveedores, tractores, furgones, vehiculos } = useData();
  const [tipoSeleccionado, setTipoSeleccionado] = useState("tractor");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);

  const [formData, setFormData] = useState({
    codigo: articulo?.codigo || "",
    descripcion: articulo?.descripcion || "",
    tipo: articulo?.tipo || "",
    unidad: articulo?.unidad || "unidades",
    proveedor: articulo?.proveedor || "",
    codigoProveedor: articulo?.codigoProveedor || "",
    marca: articulo?.marca || "",
    cantidad: articulo?.cantidad || 0,
    detalle: articulo?.detalle || "",
    // en caso de ser recuperacion
    tractor: articulo?.tractor || "",
    furgon: articulo?.furgon || "",
    vehiculo: articulo?.vehiculo || "",
  });

  const tiposDisponibles = Object.entries(Codigos).map(([key, value]) => ({
    value: key,
    tipo: value.tipo,
    label: `${value.tipo.toUpperCase()} (${value.descripcion})`,
    descripcion: value.descripcion,
    tipotxt: value.tipo,
  }));

  useEffect(() => {
    if (articulo) setModoEdicion(true);
  }, [articulo]);

  useEffect(() => {
    if (formData.tipo === "RC") {
      setFormData((prev) => ({ ...prev, proveedor: "0X" }));
    } else if (formData.tipo !== "RC" && formData.proveedor === "0X") {
      setFormData((prev) => ({ ...prev, proveedor: "" }));
    }
  }, [formData.tipo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleClickProveedor = () => {
    setModalProveedorVisible(true);
  };

  const cerrarModalProveedor = () => {
    setModalProveedorVisible(false);
  };

  const handleTipoSeleccionado = (tipoSelect) => {
    setTipoSeleccionado(tipoSelect);

    setFormData((prev) => ({
      ...prev,
      tractor: tipoSelect === "tractor" ? prev.tractor : "",
      furgon: tipoSelect === "furgon" ? prev.furgon : "",
      vehiculo: tipoSelect === "vehiculo" ? prev.vehiculo : "",
    }));
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault(); // para evitar el error al abrirlo desde otro form como modal
    setLoading(true);

    try {
      if (modoEdicion) {
        const articuloEditado = {
          ...formData,
          descripcion: formData.descripcion.toUpperCase(),
          unidad: articulo.unidad.toUpperCase() || "UNIDADES",
          proveedor: formData.proveedor || null,
          codigoProveedor: formData.codigoProveedor || null,
          marca: formData.marca.toUpperCase() || null,
          detalle: formData.detalle.toUpperCase() || null,
          // recuperacion
          tractor: formData.tractor || null,
          furgon: formData.furgon || null,
          vehiculo: formData.vehiculo || null,
        };

        await modificar("stock", articulo.id, articuloEditado);
        onGuardar?.(articuloEditado);
      } else {
        // Obtener solo los códigos correctos
        const txtTipo = Codigos[formData.tipo]?.tipo;

        // Llamada correcta a codigoStock
        const codArticulo = await codigoStock(
          stock,
          txtTipo, // tipo en string (ej: "motor")
          formData.tipo, // prefijo string (ej: "MT")
          formData.proveedor // proveedor string (ej: "02")
        );

        const nuevoArticulo = {
          ...formData,
          codigo: codArticulo,
          descripcion: formData.descripcion?.toUpperCase() || "",
          tipo: Codigos[formData.tipo]?.tipo,
          unidad: formData.unidad?.toUpperCase() || "UNIDADES",
          proveedor: formData.proveedor || null,
          codigoProveedor: formData.codigoProveedor.toUpperCase() || null,
          marca: formData.marca?.toUpperCase() || null,
          cantidad: Number(formData.cantidad) || 0,
          detalle: formData.detalle?.toUpperCase() || null,
          // recuperacion
          tractor: formData.tractor || null,
          furgon: formData.furgon || null,
          vehiculo: formData.vehiculo || null,
        };

        //prueba de codigo
        /*
       await Swal.fire({
        title: "Código generado",
        text: `Se creó el código: ${codArticulo}`,
        icon: "info",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#4161bd",
      });
      */

        await agregar("stock", nuevoArticulo, nuevoArticulo.codigo);
        onGuardar?.(nuevoArticulo);

        //en caso de recuperación, el faltante se le va a restar al vehiculo desde el eventotaller
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
      console.error("Error al guardar articulo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>
          {modoEdicion ? "MODIFICAR " + formData.tipo.toUpperCase() : "NUEVO"}
        </h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <p className="ficha-info-title">
            <strong>Informacion</strong>
          </p>
          <div className="ficha-info">
            {/* tipo de articulo */}
            <label>
              Tipo *
              <Select
                options={tiposDisponibles.map((opt) => ({
                  value: String(opt.value), // asegurar string
                  tipo: opt.tipo,
                  label: opt.label,
                  descripcion: opt.descripcion,
                  tipotxt: opt.tipotxt,
                }))}
                value={
                  formData.tipo
                    ? tiposDisponibles.find(
                        (opt) => String(opt.tipotxt) === String(formData.tipo)
                      )
                    : null
                }
                onChange={(opt) =>
                  handleChange({
                    target: {
                      name: "tipo",
                      value: opt ? String(opt.value) : "",
                    },
                  })
                }
                placeholder=""
                isClearable
                required
                disabled={modoEdicion}
              />
            </label>
            {/* descripcipon */}
            <label>Descripción</label>
            <input
              type="text"
              style={{ textTransform: "uppercase" }}
              value={formData.descripcion}
              onChange={handleChange}
              name="descripcion"
            ></input>
          </div>
          <div className="ficha-info">
            {/* marca */}
            <label>Marca</label>
            <input
              type="text"
              style={{ textTransform: "uppercase" }}
              value={formData.marca}
              onChange={handleChange}
              name="marca"
            ></input>
            {/* proveedor */}
            <label>Proveedor</label>

            <div className="select-with-button">
              <Select
                className="select-grow"
                options={proveedores.map((opt) => ({
                  value: String(opt.id),
                  label: opt.id + " - " + opt.nombre,
                  cuit: opt.cuit,
                }))}
                value={
                  formData.tipo === "RC"
                    ? { value: "0X", label: "OX - REUTILIZADO" }
                    : formData.proveedor
                    ? proveedores
                        .map((opt) => ({
                          value: String(opt.id),
                          label: opt.id + " - " + opt.nombre,
                          cuit: opt.cuit,
                        }))
                        .find((opt) => opt.value === String(formData.proveedor))
                    : null
                }
                onChange={(opt) =>
                  handleChange({
                    target: {
                      name: "proveedor",
                      value: opt ? String(opt.value) : "",
                    },
                  })
                }
                placeholder="Seleccionar proveedor..."
                isClearable
                isDisabled={formData.tipo === "RC"}
                required
              />
              <TextButton
                text="+"
                className="mini-btn"
                onClick={handleClickProveedor}
              />
            </div>
            <label>Codigo Proveedor</label>
            <input
              type="text"
              style={{ textTransform: "uppercase" }}
              value={formData.codigoProveedor}
              onChange={handleChange}
              name="codigoProveedor"
            ></input>
          </div>
          {formData.tipo === "RC" && (
            <>
              <label className="ficha-subtitle">Repuesto recuperado</label>
              <div className="ficha-info">
                <div className="type-container-small">
                  <button
                    type="button"
                    className={
                      tipoSeleccionado === "tractor"
                        ? "type-btn positive-active-black"
                        : "type-btn"
                    }
                    onClick={() => handleTipoSeleccionado("tractor")}
                  >
                    TRACTOR
                  </button>
                  <button
                    type="button"
                    className={
                      tipoSeleccionado === "furgon"
                        ? "type-btn positive-active-black"
                        : "type-btn"
                    }
                    onClick={() => handleTipoSeleccionado("furgon")}
                  >
                    FURGON
                  </button>
                  <button
                    type="button"
                    className={
                      tipoSeleccionado === "vehiculo"
                        ? "type-btn positive-active-black"
                        : "type-btn"
                    }
                    onClick={() => handleTipoSeleccionado("vehiculo")}
                  >
                    VEHICULO
                  </button>
                </div>
                <label>
                  {tipoSeleccionado === "tractor" && (
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
                          required={
                            tipoSeleccionado === "tractor" &&
                            formData.tipo === "RC"
                          }
                        />
                        <TextButton
                          text="+"
                          className="mini-btn"
                          //onClick={handleClickTractor}
                        />
                      </div>
                    </label>
                  )}
                  {tipoSeleccionado === "furgon" && (
                    <label>
                      Furgon *
                      <div className="select-with-button">
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
                            required={
                              tipoSeleccionado === "furgon" &&
                              formData.tipo === "RC"
                            }
                          />
                          <TextButton
                            text="+"
                            className="mini-btn"
                            //onClick={handleClickTractor}
                          />
                        </div>
                      </div>
                    </label>
                  )}
                  {tipoSeleccionado === "vehiculo" && (
                    <label>
                      Vehiculo *
                      <div className="select-with-button">
                        <div className="select-with-button">
                          <Select
                            className="select-grow"
                            options={vehiculos
                              .map((v) => ({
                                value: v.id,
                                label: `${v.dominio} (${v.marca})`,
                                marca: v.marca,
                              }))
                              .sort((a, b) => a.int - b.int)}
                            value={
                              formData.vehiculo
                                ? (() => {
                                    const vehiculoSel = vehiculos.find(
                                      (v) => v.id === formData.vehiculo
                                    );
                                    return vehiculoSel
                                      ? {
                                          value: vehiculoSel.id,
                                          label: `${vehiculoSel.dominio} (${vehiculoSel.marca})`,
                                        }
                                      : null;
                                  })()
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
                            required={
                              tipoSeleccionado === "vehiculo" &&
                              formData.tipo === "RC"
                            }
                          />
                          <TextButton
                            text="+"
                            className="mini-btn"
                            //onClick={handleClickVehiculo}
                          />
                        </div>
                      </div>
                    </label>
                  )}
                </label>
              </div>
            </>
          )}

          <div className="ficha-info">
            {/* detalle */}
            <label>Detalle</label>
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
            />
          </div>
          <div className="form-buttons">
            <TextButton
              text={loading ? "Guardando..." : "Guardar"}
              type="submit"
              disabled={loading}
            />
            <TextButton text="Cancelar" onClick={onClose} type="button" />
          </div>
        </form>

        {modalProveedorVisible && (
          <FormProveedor onClose={cerrarModalProveedor} onGuardar={onGuardar} />
        )}
      </div>
    </div>
  );
};

export default FormStock;

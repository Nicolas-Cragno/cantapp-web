// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useData } from "../../context/DataContext";
import Select from "react-select";

// ----------------------------------------------------------------------- imports internos
import { agregar, modificar } from "../../functions/dbFunctions";
import { codigoStock } from "../../functions/dataFunctions";
import TextButton from "../buttons/TextButton";

// -----------------------------------------------------------------------
import Codigos from "../../functions/data/articulos.json";
import Proveedores from "../../functions/data/proveedores.json";
import Medidas from "../../functions/data/unidades.json";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Forms.css";
import FormProveedor from "./FormProveedor";

const FormStock = ({ articulo = null, onClose, onGuardar }) => {
  const [loading, setLoading] = useState(false);
  const { stock, proveedores } = useData();
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
  });

  const tiposDisponibles = Object.entries(Codigos).map(([key, value]) => ({
    value: key,
    label: `${value.tipo.toUpperCase()} (${value.descripcion})`,
    descripcion: value.descripcion,
    tipotxt: value.tipo,
  }));

  useEffect(() => {
    if (articulo) setModoEdicion(true);
  }, [articulo]);

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
          codigoProveedor: formData.codigoProveedor || null,
          marca: formData.marca?.toUpperCase() || null,
          cantidad: Number(formData.cantidad) || 0,
          detalle: formData.detalle?.toUpperCase() || null,
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
                  formData.proveedor
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

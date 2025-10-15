// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import { FaCirclePlus } from "react-icons/fa6";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  sumarMultiplesCantidades,
  obtenerNombreUnidad,
} from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- jsons
import Proveedores from "../../functions/data/proveedores.json";
import Sectores from "../../functions/data/areas.json";
import Unidades from "../../functions/data/unidades.json";

// ----------------------------------------------------------------------- visuales
import "./css/Forms.css";
import { agregarEvento } from "../../functions/db-functions";

const FormularioMovimientoStock = ({ onClose, onGuardar }) => {
  const { stock } = useData();
  const [area, setArea] = useState("ADMINISTRACION"); //para saber a que sector atribuir el evento
  const [articulos, setArticulos] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState("");
  const [factura, setFactura] = useState("");
  const [proveedor, setProveedor] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [ingresos, setIngresos] = useState([]);
  const [esFactura, setEsFactura] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState("ALTA");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  console.log("Ingresos:", ingresos);
  const proveedoresDisponibles = Object.entries(Proveedores).map(
    ([key, value]) => ({
      value: value.codigo,
      label: `${value.cuit} - ${key.toUpperCase()}`,
      cuit: value.cuit,
    })
  );
  const sectoresDisponibles = Object.entries(Sectores).map(([key, value]) => ({
    value: value,
    label: key.toUpperCase(),
  }));
  useEffect(() => {
    const fetchArticulos = async () => {
      setArticulos(stock);
      setLoading(false);
    };

    fetchArticulos();
  }, []);
  const handleAgregar = () => {
    if (!articuloSeleccionado || !cantidad || isNaN(cantidad)) {
      Swal.fire(
        "Error",
        "Selecciona un artículo y una cantidad válida",
        "warning"
      );
      return;
    }

    const articulo = articulos.find((a) => a.id === articuloSeleccionado);

    const nuevoIngreso = {
      logo:
        tipoMovimiento === "ALTA" ? (
          <FaArrowAltCircleUp />
        ) : (
          <FaArrowAltCircleDown />
        ),
      id: articulo.id,
      descripcion: articulo.descripcion,
      cantidad:
        tipoMovimiento === "ALTA"
          ? Number(cantidad)
          : -Math.abs(Number(cantidad)),
      unidad: articulo.unidad,
      tipo: tipoMovimiento,
    };

    setIngresos((prev) => [...prev, nuevoIngreso]);

    setArticuloSeleccionado("");
    setCantidad("");
  };
  const handleEliminar = (indexEliminar) => {
    setIngresos((ing) => ing.filter((_, i) => i !== indexEliminar));
  };
  const handleGuardar = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (ingresos.length === 0) {
      Swal.fire("Atención", "No hay artículos cargados", "info");
      return;
    }

    const resumenIngresos = ingresos
      .map(
        (i) =>
          `<p><strong style="background-color:black; color:#fff; padding:.3rem;border-radius:5rem;font-size:small;">${
            i.cantidad
          } ${Unidades[i.unidad.toUpperCase()]}</strong> ${i.descripcion} ${
            i.codigoProveedor ? "(" + i.codigoProveedor + ")" : ""
          }</p>`
      )
      .join("<br>");

    const confirmacion = await Swal.fire({
      title: "Confirmar movimiento",
      html: `
      <div style="text-align:center;margin-top:10px;" class="form-box2">
        ${resumenIngresos}
      </div>
      <p>Sector: ${area}</p>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Modificar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      width: 600,
    });

    if (!confirmacion.isConfirmed) {
      setUploading(false);
      return;
    }

    try {
      // registro para actualizar stock
      const ingresosMap = {};
      ingresos.forEach((item) => {
        if (ingresosMap[item.id]) {
          ingresosMap[item.id] += item.cantidad;
        } else {
          ingresosMap[item.id] = item.cantidad;
        }
      });

      await sumarMultiplesCantidades(ingresosMap);

      // registro para evento
      const datosEvento = {
        fecha: new Date(),
        tipo: "MOVIMIENTO DE STOCK",
        area: area,
        proveedor: proveedor ? proveedor : null,
        factura: factura ? factura : null,
        ingresos: ingresos.map((i) => ({
          id: i.id,
          cantidad: i.cantidad,
          unidad: i.unidad,
        })),
      };

      await agregarEvento(datosEvento, area.toLowerCase());

      if (
        esFactura
          ? Swal.fire("Éxito", "Factura cargada correctamente", "success")
          : Swal.fire("Éxito", "Stock actualizado correctamente", "success")
      );
      if (onGuardar) onGuardar();
      onClose();
    } catch (err) {
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>MOVIMIENTO DE STOCK</h2>
        <hr />
        <form>
          <div className="type-container">
            <button
              type="button"
              className={
                esFactura ? "type-btn positive-active-black" : "type-btn"
              }
              onClick={() => {
                setEsFactura(!esFactura);
                setTipoMovimiento("ALTA");
              }}
            >
              PROVEEDOR
            </button>
          </div>
          {/* info de la factura */}
          {esFactura && (
            <>
              <label className="form-title">Datos del remito</label>
              <div className="form-box2">
                <label>Factura</label>
                <input
                  type="text"
                  style={{ textTransform: "uppercase" }}
                  value={factura}
                  onChange={(e) => setFactura(e.target.value)}
                  name="factura"
                ></input>
                <label>Proveedor</label> {proveedor}
                <Select
                  options={proveedoresDisponibles.map((opt) => ({
                    value: String(opt.value), // asegurar string
                    label: opt.label,
                    cuit: opt.cuit,
                  }))}
                  value={
                    proveedor
                      ? proveedoresDisponibles.find(
                          (opt) => String(opt.value) === String(proveedor)
                        )
                      : null
                  }
                  onChange={(opt) => setProveedor(opt ? opt.cuit : null)}
                  placeholder=""
                  isClearable
                  required
                />
              </div>
            </>
          )}
          {/* carga de ingresos*/}
          <br />
          <label className="form-title">
            Registro articulos, repuestos, etc
          </label>
          <div className="form-box2">
            <label>
              Area / Sector
              <Select
                options={sectoresDisponibles}
                value={
                  area
                    ? sectoresDisponibles.find((opt) => opt.value === area)
                    : null
                }
                onChange={(opt) => setArea(opt ? opt.label : null)}
                placeholder="Seleccionar sector..."
                noOptionsMessage={() => "No hay sectores disponibles"}
              />
            </label>
            <br />
            {!esFactura && (
              <div className="type-container">
                <button
                  type="button"
                  className={
                    tipoMovimiento === "ALTA" ? "type-btn active" : "type-btn"
                  }
                  onClick={() => setTipoMovimiento("ALTA")}
                  disabled={esFactura}
                >
                  ALTA
                </button>
                <button
                  type="button"
                  className={
                    tipoMovimiento === "BAJA" ? "type-btn active" : "type-btn"
                  }
                  onClick={() => setTipoMovimiento("BAJA")}
                  disabled={esFactura}
                >
                  BAJA
                </button>
              </div>
            )}
            <label>
              Artículo
              <Select
                className="select-grow"
                isDisabled={loading}
                options={articulos
                  .map((a) => ({
                    value: a.id,
                    label: `${a.id} - ${a.descripcion} ${
                      a.codigoProveedor ? "(" + a.codigoProveedor + ")" : ""
                    }`,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label))}
                value={
                  articuloSeleccionado
                    ? {
                        value: articuloSeleccionado,
                        label: `${articuloSeleccionado} - ${
                          articulos.find((a) => a.id === articuloSeleccionado)
                            ?.descripcion || ""
                        }`,
                      }
                    : null
                }
                onChange={(opt) => {
                  if (opt) {
                    setArticuloSeleccionado(opt.value);
                    const articulo = articulos.find((a) => a.id === opt.value);
                    setUnidad(articulo ? articulo.unidad : "");
                  } else {
                    setArticuloSeleccionado("");
                    setUnidad("");
                  }
                }}
                placeholder="Seleccionar artículo..."
                noOptionsMessage={() => "No hay artículos disponibles"}
              />
            </label>
            <div className="input-inline">
              <label>
                Cantidad
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="1"
                />
              </label>
              <div className="unidad-display">
                <input type="text" value={unidad.toUpperCase()} disabled />
                <button
                  className="plus-btn"
                  type="button"
                  onClick={handleAgregar}
                >
                  <FaCirclePlus className="plus-logo" />
                </button>
              </div>
            </div>
          </div>
          <br />
          {/* listado de ingresos */}
          <label className="form-title">Movimiento a registrar</label>
          <div className="form-box2">
            {ingresos.length === 0 ? (
              <p>...</p>
            ) : (
              <ul className="list">
                {ingresos.map((item, index) => (
                  <li key={index} className="list-item">
                    <div
                      className={`item-info ${
                        item.tipo === "BAJA" ? "item-rojo" : "item-verde"
                      }`}
                    >
                      {item.logo}
                    </div>
                    <div className="item-info-small">
                      <strong>{item.id}</strong>
                    </div>
                    <div className="item-info-smaller">{item.descripcion}</div>
                    <div className="item-actions">
                      <span className="list-cant">
                        {item.cantidad} {Unidades[item.unidad.toUpperCase()]}
                      </span>

                      <button
                        className="delete-btn"
                        type="button"
                        onClick={() => handleEliminar(index)}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={uploading} onClick={handleGuardar}>
              {uploading ? "Guardando..." : "Guardar"}
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

export default FormularioMovimientoStock;

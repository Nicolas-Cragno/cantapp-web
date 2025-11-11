// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import { FaCirclePlus as LogoPlus } from "react-icons/fa6";
import {
  FaArrowAltCircleUp as LogoUp,
  FaArrowAltCircleDown as LogoDown,
} from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import { agregarEvento } from "../../functions/eventFunctions";
import {
  sumarMultiplesCantidades,
  agregarStockADeposito,
  buscarId,
  buscarNombre,
  buscarRepuestoPorID,
} from "../../functions/dataFunctions";
import { modificar } from "../../functions/dbFunctions";
import Sectores from "../../functions/data/areas.json";
import Unidades from "../../functions/data/unidades.json";
import FormProveedor from "./FormProveedor";
import FormStock from "./FormStock";
import TextButton from "../buttons/TextButton";
import "./css/Forms.css";

const FormMovimientoStock = ({
  elemento = null,
  taller = "tractores",
  onClose,
  onGuardar,
}) => {
  const { stock, proveedores, sectores } = useData();
  //const [area, setArea] = useState(null); //para saber a que sector atribuir el evento
  const [articulos, setArticulos] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState("");
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);
  const [modalArticuloVisible, setModalArticuloVisible] = useState(false);
  const [proveedor, setProveedor] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [valor, setValor] = useState(0);
  const [valorFinal, setValorFinal] = useState(0);
  const [moneda, setMoneda] = useState("pesos");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ingresos, setIngresos] = useState(
    elemento?.ingresos?.map((ings) => ({
      ...ings,
      logo: ings.cantidad < 0 ? <LogoDown /> : <LogoUp />,
    })) || []
  );
  const [esFactura, setEsFactura] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState("ALTA");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    area: elemento?.area ? elemento.area : taller,
    ingresos: elemento?.ingresos?.map((ings) => ({
      ...ings,
      id: ings.id,
      cantidad: ings.cantidad,
      descripcion: stock.find((s) => s.id === ings.id).descripcion,
      unidad: ings.unidad,
      valor: ings.valor,
      moneda: ings.moneda,
      logo: ings.cantidad < 0 ? <LogoDown /> : <LogoPlus />,
    })),
    moneda: elemento?.moneda ? elemento.moneda : "pesos",
    remito: elemento?.remito ? elemento.remito : "",
    factura: elemento?.factura ? elemento.factura : "",
    proveedor: elemento?.proveedor ? elemento.proveedor : "",
  });

  useEffect(() => {
    if (elemento?.id) {
      setModoEdicion(true);
    }
  }, []);

  /*
  useEffect(() => {
    setArea(taller);
  }, []);
  */

  useEffect(() => {
    const nuevoValorFinal = ingresos.reduce(
      (total, i) => total + i.cantidad * (i.valor || 0),
      0
    );
    setValorFinal(nuevoValorFinal);
  }, [ingresos]);

  useEffect(() => {
    if (elemento?.proveedor) {
      setEsFactura(true);
    }
  }, [elemento]);

  console.log("Ingresos:", ingresos);

  const sectoresDisponibles = Object.entries(Sectores).map(([key, value]) => ({
    value: value,
    label: key.toUpperCase(),
  }));

  useEffect(() => {
    const fetchArticulos = async () => {
      setLoading(true);

      let filtrados = stock;

      if (proveedor !== null) {
        filtrados = stock.filter(
          (a) => a.proveedor === buscarId(proveedores, "cuit", proveedor)
        );
      }

      setArticulos(filtrados);
      setLoading(false);
    };

    fetchArticulos();
  }, [ingresos, proveedor, stock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  useEffect(() => {
    setFormData((prev) => ({ ...prev, moneda }));
  }, [moneda]);
  const handleClickProveedor = async () => {
    setModalProveedorVisible(true);
  };
  const cerrarModalProveedor = async () => {
    setModalProveedorVisible(false);
  };
  const handleClickArticulo = async () => {
    setModalArticuloVisible(true);
  };
  const cerrarModalArticulo = async () => {
    setModalArticuloVisible(false);
  };

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
      logo: tipoMovimiento === "ALTA" ? <LogoUp /> : <LogoDown />,
      id: articulo.id,
      descripcion: articulo.descripcion,
      cantidad:
        tipoMovimiento === "ALTA"
          ? Number(cantidad)
          : -Math.abs(Number(cantidad)),
      unidad: articulo.unidad,
      valor: Number(valor) || 0,
      moneda: moneda, //moneda asignada globalmente pero tiraba error, restauré
      tipo: tipoMovimiento,
    };

    setIngresos((prev) => [...prev, nuevoIngreso]);

    setValorFinal((prev) => prev + nuevoIngreso.valor * nuevoIngreso.cantidad);

    setArticuloSeleccionado("");
    setCantidad("");
    setValor(0);
    setMoneda("pesos");
  };
  const handleEliminar = (indexEliminar) => {
    setIngresos((ing) => ing.filter((_, i) => i !== indexEliminar));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (ingresos.length === 0) {
      Swal.fire("Atención", "No hay artículos cargados", "info");
      return;
    }

    const resumenIngresos = ingresos
      .map(
        (i) =>
          `<p style="font-size:smaller;"><strong style="background-color:black; color:#fff; padding:.3rem;border-radius:5rem;font-size:smaller;">${
            i.cantidad
          } ${Unidades[i.unidad.toUpperCase()]}</strong> ${i.descripcion} ${
            i.codigoProveedor ? "(" + i.codigoProveedor + ")" : ""
          }${
            esFactura
              ? (moneda === "pesos" ? "- AR$ " : "- U$D ") + i.valor + " c/u"
              : ""
          }</p>`
      )
      .join("<br>");

    const confirmacion = await Swal.fire({
      title: "Confirmar movimiento",
      html: `
      <div style="text-align:center;margin-top:10px;" class="form-box2">
        ${resumenIngresos}
      </div>
      <p>Sector: ${formData.area}</p>
      <p>${
        esFactura
          ? "Total: " + (moneda === "pesos" ? " AR$ " : " U$D ") + valorFinal
          : ""
      }</p>
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
        tipo: "STOCK",
        area: formData.area || null,
        proveedor: formData.proveedor || null,
        remito: formData.remito || null,
        factura: formData.factura || null,
        moneda: moneda || "pesos",
        ingresos: ingresos.map((i) => ({
          id: i.id,
          cantidad: i.cantidad,
          unidad: i.unidad,
          valor: i.valor,
          moneda: i.moneda,
        })),
      };

      let idEvento;

      if (!modoEdicion) {
        const { id: idNuevo } = await agregarEvento(
          datosEvento,
          formData.area.toLowerCase()
        );

        idEvento = idNuevo;
      } else {
        await modificar("eventos", elemento.id, datosEvento);
        idEvento = elemento.id;
      }

      const idDeposito = formData.area.toLowerCase();
      for (const ingreso of ingresos) {
        await agregarStockADeposito(idDeposito, {
          id: ingreso.id,
          cantidad: ingreso.cantidad,
          unidad: ingreso.unidad,
          evento: idEvento,
        });
      }

      await Swal.fire({
        icon: "success",
        title: esFactura
          ? "Factura cargada correctamente"
          : "Stock actualizado correctamente",
      });

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
              <label className="form-title">Datos del remito/factura</label>
              <div className="form-box2">
                <label>Remito</label>
                <input
                  type="text"
                  style={{ textTransform: "uppercase" }}
                  value={formData.remito}
                  onChange={handleChange}
                  name="remito"
                ></input>
                <label>Factura</label>
                <div className="select-with-button">
                  <input
                    type="text"
                    style={{ textTransform: "uppercase" }}
                    value={formData.factura}
                    onChange={handleChange}
                    name="factura"
                  ></input>
                  <button
                    type="button"
                    className={
                      moneda === "pesos" ? "type-btn active" : "type-btn"
                    }
                    onClick={() => setMoneda("pesos")}
                  >
                    AR$
                  </button>
                  <button
                    type="button"
                    className={
                      moneda === "dolares"
                        ? "type-btn active-green"
                        : "type-btn"
                    }
                    onClick={() => setMoneda("dolares")}
                  >
                    U$D
                  </button>
                </div>
                <label>Proveedor</label>

                <div className="select-with-button">
                  <Select
                    className="select-grow"
                    options={proveedores
                      .filter((pr) => pr.id !== "01")
                      .map((opt) => ({
                        value: String(opt.id),
                        label:
                          opt.id + " - " + opt.nombre + " (" + opt.marca + ")",
                        cuit: opt.cuit,
                      }))}
                    value={
                      formData.proveedor
                        ? proveedores
                            .map((opt) => ({
                              value: String(opt.id),
                              label:
                                opt.id +
                                " - " +
                                opt.nombre +
                                " (" +
                                opt.marca +
                                ")",
                              cuit: opt.cuit,
                            }))
                            .find(
                              (opt) =>
                                opt.value === formData.proveedor ||
                                String(opt.value) === String(proveedor)
                            )
                        : null
                    }
                    onChange={(selectedProv) =>
                      handleChange({
                        target: {
                          name: "proveedor",
                          value: selectedProv ? selectedProv.value : "",
                        },
                      })
                    }
                    placeholder=""
                    isClearable
                    required
                  />
                  {/*
                  <TextButton
                    text="+"
                    className="mini-btn"
                    onClick={handleClickProveedor}
                    type="button"
                  />
                   */}
                </div>
              </div>
            </>
          )}
          {/* carga de ingresos*/}
          <br />
          <label className="form-title">Area o sector correspondiente</label>
          <div className="form-box2">
            <label>
              Area / Sector
              <Select
                options={sectores.map((opt) => ({
                  value: opt.nombre, // o opt.id si querés usar el id
                  label: opt.id + " - " + opt.nombre,
                }))}
                value={
                  formData.area
                    ? {
                        value: formData.area,
                        label:
                          sectores.find(
                            (opt) => opt.nombre === formData.area.toUpperCase()
                          )?.id +
                            " - " +
                            formData.area.toUpperCase() || "",
                      }
                    : null
                }
                onChange={(selectedArea) =>
                  handleChange({
                    target: {
                      name: "area",
                      value: selectedArea ? selectedArea.value : "",
                    },
                  })
                }
                placeholder="Seleccionar sector..."
                noOptionsMessage={() => "No hay sectores disponibles"}
                disabled={taller}
              />
            </label>
          </div>
          <br />
          <label className="form-title">
            Registro articulos, repuestos, etc
          </label>
          <div className="form-box2">
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
              <div className="select-with-button">
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
                      const articulo = articulos.find(
                        (a) => a.id === opt.value
                      );
                      setUnidad(articulo ? articulo.unidad : "");
                    } else {
                      setArticuloSeleccionado("");
                      setUnidad("");
                    }
                  }}
                  placeholder="Seleccionar artículo..."
                  noOptionsMessage={() => "No hay artículos disponibles"}
                />
                {/*
                <TextButton
                  text="+"
                  className="mini-btn"
                  onClick={handleClickArticulo}
                  type="button"
                />
                 */}
              </div>
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
              </div>
            </div>
            <div className="input-inline">
              <label>
                Valor / Precio
                <input
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  min="0"
                />
              </label>

              <div className="type-container">
                <button
                  className="plus-btn"
                  type="button"
                  onClick={handleAgregar}
                >
                  <LogoPlus className="plus-logo" />
                </button>
              </div>
            </div>
          </div>
          <br />
          {/* listado de ingresos */}
          <label className="form-title">Movimiento a registrar</label>
          {esFactura && (
            <label className="form-title">
              {moneda === "pesos" ? "AR$" : "U$D"}{" "}
              {valorFinal.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </label>
          )}
          <div className="form-box2">
            {ingresos.length === 0 ? (
              <p>...</p>
            ) : (
              <ul className="list">
                {ingresos.map((item, index) => (
                  <li key={index} className="list-item">
                    <div
                      className={`item-info ${
                        item.cantidad < 0 ? "item-rojo" : "item-verde"
                      }`}
                    >
                      {item.logo}
                    </div>
                    <div className="item-info-small">
                      <strong>{item.id}</strong>
                    </div>
                    <div className="item-info-smaller">
                      {item.descripcion
                        ? item.descripcion
                        : stock.find((s) => s.id === item.id).descripcion}
                    </div>
                    <div className="item-actions">
                      <span className="list-cant3">
                        {item.cantidad} {Unidades[item.unidad.toUpperCase()]}{" "}
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
          {modalProveedorVisible && (
            <FormProveedor
              onClose={cerrarModalProveedor}
              onGuardar={cerrarModalProveedor}
            />
          )}
          {modalArticuloVisible && (
            <FormStock
              onClose={cerrarModalArticulo}
              onGuardar={cerrarModalArticulo}
            />
          )}

          <div className="form-buttons">
            <button type="submit" disabled={uploading} onClick={handleSubmit}>
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

export default FormMovimientoStock;

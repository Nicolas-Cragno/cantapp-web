// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
import {
  FaArrowAltCircleUp as LogoUp,
  FaArrowAltCircleDown as LogoDown,
} from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../../context/DataContext";
import {
  formatearFecha,
  formatearHora,
  buscarEmpresa,
} from "../../functions/dataFunctions";
import TextButton from "../buttons/TextButton";
import Unidades from "../../functions/data/unidades.json";
import "./css/Fichas.css";

const FichaEventoStock = ({ elemento, onClose, onGuardar }) => {
  const { proveedores, stock } = useData();
  const [modoEdicion, setModoEdicion] = useState(false);

  if (!elemento) return null;

  const fechaFormateada = formatearFecha(elemento.fecha);
  const horaFormateada = formatearHora(elemento.fecha);

  const ingresos = Array.isArray(elemento.ingresos) ? elemento.ingresos : [];

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
            <h1 className="event-subtipo">{elemento.id || "EVENTO"}</h1>
            <hr />
            <div className="hora">
              <span>{fechaFormateada}</span>
              <span>{horaFormateada} HS</span>
            </div>

            <div className="ficha-info">
              <p>
                <strong>Tipo: </strong> {elemento.tipo}
              </p>
              <p>
                <strong>Área / Sector: </strong> {elemento.area?.toUpperCase()}
              </p>
              {elemento.proveedor && (
                <p>
                  <strong>Proveedor: </strong>{" "}
                  {buscarEmpresa(proveedores, elemento.proveedor)}
                </p>
              )}
              {elemento.remito && (
                <p>
                  <strong>Remito: </strong> {elemento.remito}
                </p>
              )}
              {elemento.factura && (
                <p>
                  <strong>Factura: </strong> {elemento.factura.toUpperCase()}
                </p>
              )}
            </div>

            <div className="ficha-info">
              <p>
                <strong>Ingresos:</strong>
              </p>
              {ingresos.length === 0 ? (
                <p>Sin artículos cargados</p>
              ) : (
                <ul className="list">
                  {ingresos.map((i, index) => (
                    <li key={index} className="list-item">
                      <div
                        className={`item-info ${
                          i.cantidad < 0 ? "item-rojo" : "item-verde"
                        }`}
                      >
                        {i.cantidad > 0 ? <LogoUp /> : <LogoDown />}
                      </div>
                      <div className="item-info-small">
                        <strong>{i.id}</strong>
                      </div>
                      <div className="item-info-smaller">
                        {stock.find((s) => s.id === i.id).descripcion}
                      </div>
                      <div className="item-actions">
                        <span className="list-cant">
                          {i.cantidad} {Unidades[i.unidad.toUpperCase()]}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {elemento.usuario && (
              <p>
                Cargado por <strong>{elemento.usuario}</strong>
              </p>
            )}

            <div className="ficha-buttons">
              <TextButton text="Cerrar" onClick={onClose} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FichaEventoStock;

// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import {
  formatearFecha,
  formatearFechaCorta,
  formatearHora,
  buscarEmpresa,
  buscarNombre,
} from "../../functions/dataFunctions";
import TablaColeccion from "../tablas/TablaColeccion";
import FichaEventosGestor from "../fichas/FichaEventosGestor";
import "./css/Modales.css";

const ModalEventos = ({
  tipo = null,
  filtroSector = null,
  onRowClick = null,
  onClose,
}) => {
  const [filtro, setFiltro] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const { eventos, proveedores, personas, stock } = useData();
  const columnasDerecha = [
    {
      titulo: "CARGA",
      campo: "usuario",
      render: (u) => u.toUpperCase(),
      offresponsive: true,
    },
  ];
  const columnas = [
    {
      titulo: "ID",
      campo: "id",
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFechaCorta(v),
      onresponsive: true,
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFecha(v) + " - " + formatearHora(v) + " hs",
      offresponsive: true,
    },
    /*
    {
      titulo: "TIPO",
      campo: "tipo",
    },
    */
    {
      titulo: "AREA/SECTOR",
      campo: "area",
      render: (a) => a.toUpperCase(),
      offresponsive: true,
    },
    ...columnasDerecha,
  ];

  const columnasMovimientoStock = [
    ...columnas,
    {
      titulo: "FACTURA",
      campo: "factura",
    },
    {
      titulo: "REMITO",
      campo: "remito",
    },
    {
      titulo: "PROVEEDOR",
      campo: "proveedor",
      render: (e) => buscarEmpresa(proveedores, e),
      offresponsive: true,
    },
    {
      titulo: "TOTAL",
      campo: "ingresos",
      render: (ingresos) => {
        if (!Array.isArray(ingresos) || ingresos.length === 0) return "";

        const total = ingresos.reduce((acc, item) => {
          const cantidad = parseFloat(item.cantidad) || 0;
          const valor = parseFloat(item.valor) || 0;
          return acc + cantidad * valor;
        }, 0);

        const moneda = ingresos.find((i) => i.moneda)?.moneda || "pesos";
        const simbolo = moneda === "pesos" ? "AR$" : "U$D";

        return (
          <span>
            <strong style={{ fontSize: "0.8em" }}>{simbolo}</strong>{" "}
            {total.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      titulo: "ITEMS",
      campo: "ingresos",
      render: (ingresos) => {
        if (!Array.isArray(ingresos) || ingresos.length === 0) return "-";

        return (
          <span style={{ fontSize: "0.75em" }}>
            {ingresos.map((i) => buscarNombre(stock, i.id)).join(", ")}
          </span>
        );
      },
    },
    ...columnasDerecha,
  ];

  let columnasFinal;

  switch (tipo) {
    case "STOCK":
      columnasFinal = columnasMovimientoStock;
      break;

    default:
      columnasFinal = columnas;
  }

  const eventosFiltrados = useMemo(() => {
    const listadoArea = filtroSector
      ? eventos.filter(
          (e) => e.area.toLowerCase() === filtroSector.toLowerCase()
        )
      : eventos;

    const listadoEventos = tipo
      ? listadoArea.filter((e) => e.tipo === tipo)
      : listadoArea;

    return listadoEventos.filter((e) => {
      const fecha = formatearFecha(e.fecha);
      const textoFiltro = `${e.id} ${e.tipo} ${e.fecha} ${fecha} ${e.area} ${
        e.carga
      } ${e.factura} ${e.remito} ${e.valor} ${e.moneda} ${
        e.proveedor
      } ${buscarEmpresa(proveedores, e.proveedor)}`;
      return textoFiltro.toLocaleLowerCase().includes(filtro.toLowerCase());
    });
  });

  const cerrarModalFicha = () => {
    setModalFichaVisible(false);
  };

  const handleGuardar = async () => {
    setModalFichaVisible(false);
    setEventoSeleccionado(null);
  };

  return (
    <div className="modal">
      <div className="modal-content-2">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h1 className="modal-title">
            <strong>{tipo ? tipo.toUpperCase() : "LISTADO DE EVENTOS"}</strong>{" "}
          </h1>
          <div className="modal-input-filtro">
            <label className="modal-label">FILTRO </label>
            <input
              type="text"
              placeholder="..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>
        <TablaColeccion
          columnas={columnasFinal}
          datos={eventosFiltrados}
          onRowClick={(evento) => {
            setEventoSeleccionado(evento);
            setModalFichaVisible(true);
          }}
        />

        {modalFichaVisible && (
          <FichaEventosGestor
            tipo={tipo.toLowerCase()}
            elemento={eventoSeleccionado}
            onClose={cerrarModalFicha}
            onGuardar={handleGuardar}
          />
        )}
      </div>
    </div>
  );
};

export default ModalEventos;

// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import {
  IoDocumentsSharp as LogoDoc,
  IoDocumentsOutline as LogoDoc2,
} from "react-icons/io5";
import { BsBoxes as LogoBox } from "react-icons/bs";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import useReparaciones from "../../context/hooks/useReparaciones";
import {
  formatearFecha,
  formatearFechaCorta,
  formatearHora,
  buscarEmpresa,
  buscarNombre,
} from "../../functions/dataFunctions";
import TablaColeccion from "../tablas/TablaColeccion";
import FichaEventosGestor from "../fichas/FichaEventosGestor";
import FormRemito from "../forms/FormRemito";
import FormFactura from "../forms/FormFactura";
import FormMovimientoStock from "../forms/FormMovimientoStock";
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
  const [modalRemitoVisible, setModalRemitoVisible] = useState(false);
  const [modalFacturaVisible, setModalFacturaVisible] = useState(false);
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);
  const { eventos, proveedores, personas, stock } = useData();
  const {reparaciones} = useReparaciones();
  let coleccion = eventos;

  
  if(filtroSector !== null){
    if(filtroSector === "tractores" || filtroSector === "furgones"){
      coleccion = reparaciones;
    }
  } 
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
    {
      titulo: "TIPO",
      campo: "tipo",
    },
    {
      titulo: "AREA/SECTOR",
      campo: "area",
      render: (a) => a.toUpperCase(),
      offresponsive: true,
    },
  ];
  const columnasMovimientoStock = [
    ...columnas,
    {
      titulo: "N° FC",
      campo: "factura",
    },
    {
      titulo: "N° RM",
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
      campo: "total",
      render: (t, ev) => {
        // para el nuevo formato diferenciado de fc y rm
        if (ev.total !== undefined && ev.total !== null) {
          return (
            <span>
              <strong style={{ fontSize: "0.8em" }}>
                {ev.moneda === "usd" ? "U$D" : "AR$"}
              </strong>{" "}
              {Number(ev.total).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        }

        // formato viejo (todo cargado en movimientoStock con fc y rm juntos)
        if (!Array.isArray(ev.ingresos) || ev.ingresos.length === 0) return "";
        const total = ev.ingresos.reduce((acc, item) => {
          const cantidad = parseFloat(item.cantidad) || 0;
          const valor = parseFloat(item.valor) || 0;
          return acc + cantidad * valor;
        }, 0);

        const moneda = ev.ingresos.find((i) => i.moneda)?.moneda || "pesos";
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
  const botonesIngresos = [
    {
      titulo: "Movimiento",
      logo: <LogoBox className="table-logo3" />,
      onClick: () => setModalMovimientoVisible(true),
    },
    {
      titulo: "Remito",
      logo: <LogoDoc2 className="table-logo3" />,
      onClick: () => setModalRemitoVisible(true),
    },
    {
      titulo: "Factura",
      logo: <LogoDoc className="table-logo3" />,
      onClick: () => setModalFacturaVisible(true),
    },
  ];

  let columnasFinal;

  if (tipo !== null && (tipo === "STOCK" || tipo === "REMITO" || tipo === "FACTURA")) {
    columnasFinal = columnasMovimientoStock;
  } else {
    columnasFinal = columnas;
  }

  const eventosFiltrados = useMemo(() => {
    const listadoArea = filtroSector
      ? coleccion.filter(
          (e) => e.area.toLowerCase() === filtroSector.toLowerCase()
        )
      : coleccion;

    const listadoEventos = tipo
      ? listadoArea.filter((e) => {
          if (tipo === "STOCK") {
            return ["STOCK", "FACTURA", "REMITO"].includes(e.tipo);
          }
          return e.tipo === tipo;
        })
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
        {tipo === "STOCK" && (
          <div className="table-options-group modal-footer2">
            {botonesIngresos.map((b, i) => (
              <button key={i} className="table-agregar" onClick={b.onClick}>
                {b.logo}

                <span className="table-logo-span">{b.titulo}</span>
              </button>
            ))}
          </div>
        )}

        {modalRemitoVisible && (
          <FormRemito onClose={() => setModalRemitoVisible(false)} />
        )}

        {modalFacturaVisible && (
          <FormFactura onClose={() => setModalFacturaVisible(false)} />
        )}

        {modalMovimientoVisible && (
          <FormMovimientoStock
            onClose={() => setModalMovimientoVisible(false)}
          />
        )}
        {modalFichaVisible && (
          <FichaEventosGestor
            tipo={
              ["RETIRA", "ENTREGA"].includes(eventoSeleccionado.tipo)
                ? "llave"
                : "tractores"
            }
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

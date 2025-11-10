// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";
import { IoKeySharp as LogoKey } from "react-icons/io5";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import TablaColeccion from "../../components/tablas/TablaColeccion";
import {
  formatearFecha,
  formatearFechaCorta,
  formatearHora,
  buscarPersona,
  buscarEmpresa,
  buscarDominio,
  buscarNombre,
} from "../../functions/dataFunctions";
import FichaGestor from "../../components/fichas/FichaGestor";
import ModalVehiculo from "../../components/modales/ModalVehiculo";
import ModalStock from "../../components/modales/ModalStock";
import ModalEventos from "../../components/modales/ModalEventos";
import FormGestor from "../../components/forms/FormGestor";
import FormLlave from "../../components/forms/FormLlave";
import TextButton from "../../components/buttons/TextButton";
import LogoButton from "../../components/buttons/LogoButton";
import LogoTractor from "../../assets/logos/logotractor-w.png";
import LogoFurgon from "../../assets/logos/logopuertafurgon.png";
import LogoDefault from "../../assets/logos/logo.svg";
import LogoStock from "../../assets/logos/logostock-w.png";

const Reparaciones = ({ filtroSector = "tractores" }) => {
  const AREA = filtroSector;
  const {
    eventos,
    stock,
    proveedores,
    personas,
    empresas,
    tractores,
    furgones,
    loading,
    ubicaciones,
  } = useData();
  const [filtro, setFiltro] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);
  const [modalIngresosVisible, setModalIngresosVisible] = useState(false);

  const columnasGenerales = [
    {
      titulo: "#",
      campo: "id",
      offresponsive: true,
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFecha(v) + " - " + formatearHora(v) + " hs",
      offresponsive: true,
    },
    {
      titulo: "FECHA",
      campo: "fecha",
      render: (v) => formatearFechaCorta(v),
      onresponsive: true,
    },
    {
      titulo: "TIPO",
      campo: "tipo",
      render: (v) => (
        <span
          style={{
            backgroundColor:
              v?.toUpperCase() === "SERVICE" ? "#fff59d" : "transparent",
            padding: "2px 6px",
            borderRadius: "4px",
            fontWeight: v?.toUpperCase() === "SERVICE" ? "bolder" : "",
            display: "inline-block",
          }}
        >
          {v.toUpperCase()}
        </span>
      ),
    },
    {
      titulo: "MECÁNICO / PROVEEDOR",
      campo: "mecanico",
      render: (p, fila) => {
        // Si hay mecánico(s)
        if (fila.mecanico && fila.mecanico !== "") {
          const valor = fila.mecanico;

          // Caso: es un array de IDs
          if (Array.isArray(valor)) {
            return valor.length
              ? valor
                  .map((id) => buscarPersona(personas, id))
                  .filter(Boolean)
                  .join(", ")
              : "";
          }

          // Caso: es un solo mecánico
          const mecanicoNombre = buscarPersona(personas, valor);
          if (mecanicoNombre) return mecanicoNombre;
        }

        // Si no hay mecánico pero sí proveedor
        if (fila.proveedor && fila.proveedor !== "") {
          const prov = proveedores.find(
            (prov) => String(prov.id) === String(fila.proveedor)
          );
          if (prov) return prov.nombre;
        }

        // Si no hay ninguno
        return "";
      },
      offresponsive: true,
    },
    {
      titulo: "MEC / PROV",
      campo: "mecanico",
      render: (p, fila) => {
        if (fila.mecanico && fila.mecanico !== "") {
          const valor = fila.mecanico;

          if (Array.isArray(valor)) {
            return valor
              .map((id) => buscarPersona(personas, id, false))
              .filter(Boolean)
              .join(", ");
          }

          const mecanicoNombre = buscarPersona(personas, valor, false);
          if (mecanicoNombre) return mecanicoNombre;
        }

        if (fila.proveedor && fila.proveedor !== "") {
          const prov = proveedores.find(
            (prov) => String(prov.id) === String(fila.proveedor)
          );
          if (prov) return prov.nombre;
        }

        return "";
      },
      onresponsive: true,
    },
  ];
  const columnasFinal = [
    {
      titulo: "SUCURSAL",
      campo: "sucursal",
      render: (row) => {
        // row.sucursal puede ser null o vacío
        return row ? buscarNombre(ubicaciones, row) : "DON TORCUATO";
      },
    },
  ];
  const columnasTractores = [
    ...columnasGenerales,
    {
      titulo: "INT",
      campo: "tractor",
      render: (t, fila) => {
        const valor = fila.tractor;

        if (!valor) return "";

        if (Array.isArray(valor)) {
          return valor.length ? valor.join(", ") : "";
        }

        return valor;
      },
    },
    {
      titulo: "KM",
      campo: "kilometraje",
      render: (k) => {
        if (!k) return "";
        const valor = k + " km";
        return valor;
      },
    },
    {
      titulo: "DETALLE",
      campo: "detalle",

      offresponsive: true,
    },
    ...columnasFinal,
  ];
  const columnasFurgones = [
    ...columnasGenerales,
    {
      titulo: "INT",
      campo: "furgon",
      render: (t, fila) => {
        const valor = fila.furgon;

        if (!valor) return "";

        if (Array.isArray(valor)) {
          return valor.length ? valor.join(", ") : "";
        }

        return valor;
      },
    },
    {
      titulo: "DETALLE",
      campo: "detalle",

      offresponsive: true,
    },
    ...columnasFinal,
  ];

  let columnas;

  switch (filtroSector) {
    case "tractores":
      columnas = columnasTractores;
      break;
    case "furgones":
      columnas = columnasFurgones;
      break;
    default:
      columnas = columnasGenerales;
  }

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };
  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };
  const cerrarModalKey = () => {
    setModalKeyVisible(false);
  };

  const cerrarModalTractor = () => {
    setModalTractorVisible(false);
  };

  const cerrarModalFurgon = () => {
    setModalFurgonVisible(false);
  };

  const cerrarModalStock = () => {
    setModalStockVisible(false);
  };

  const cerrarModalIngresos = () => {
    setModalIngresosVisible(false);
  };

  const handleGuardar = async () => {
    setModalAgregarVisible(false);
    setEventoSeleccionado(null);
  };

  const eventosFiltrados = useMemo(() => {
    let filtrados = eventos.filter(
      (e) => e.area === AREA && e.tipo !== "STOCK"
    );

    filtrados = filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // --- dividir el texto del filtro en palabras separadas por coma ---
    const filtros = filtro
      .split(",")
      .map((f) => f.trim().toLowerCase())
      .filter((f) => f.length > 0);

    return filtrados.filter((e) => {
      const fechaTxt = formatearFecha(e.fecha);
      const horaTxt = formatearHora(e.fecha);
      const nombre = buscarPersona(personas, e.persona) || e.persona || "";
      const operador = buscarPersona(personas, e.operador) || e.operador || "";
      const servicio = buscarEmpresa(empresas, e.servicio) || e.servicio || "";
      const tractorDominio = buscarDominio(e.tractor, tractores);
      const furgonDominio = buscarDominio(e.furgon, furgones);
      let mecanicoTxt = "";

      if (Array.isArray(e.mecanico)) {
        mecanicoTxt = e.mecanico
          .map((id) => buscarPersona(personas, id))
          .filter(Boolean)
          .join(" ");
      } else if (e.mecanico) {
        mecanicoTxt = buscarPersona(personas, e.mecanico) || e.mecanico;
      }

      const textoFiltro = `${e.subtipo || ""} ${nombre} ${e.tractor || ""} ${
        e.furgon || ""
      } ${fechaTxt} ${horaTxt} ${e.tipo || ""} ${e.usuario} ${
        e.operador
      } ${operador} ${servicio} ${
        e.vehiculo
      } ${tractorDominio} ${furgonDominio} ${e.persona} ${
        e.servicio
      } ${mecanicoTxt} ${e.proveedor}`.toLowerCase();

      // Debe incluir *todos* los términos
      return filtros.every((term) => textoFiltro.includes(term));
    });
  }, [eventos, filtro, personas, empresas, tractores, furgones, AREA]);

  return (
    <section className="table-container">
      <div className="table-header">
        <h1 className="table-logo-box">
          <img
            src={
              AREA === "tractores"
                ? LogoTractor
                : AREA === "furgones"
                ? LogoFurgon
                : LogoDefault
            }
            alt=""
            className="table-logo"
          />
          TALLER {AREA.toUpperCase()}
        </h1>{" "}
        <button
          className="table-agregar"
          onClick={() => setModalIngresosVisible(true)}
        >
          <span className="table-logo-span">Ingresos stock</span>
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="table-busqueda"
        />
      </div>

      {loading ? (
        <div className="loading-item">
          <LogoLoading className="spinner" />
        </div>
      ) : (
        <TablaColeccion
          columnas={columnas}
          datos={eventosFiltrados}
          onRowClick={(evento) => setEventoSeleccionado(evento)}
        />
      )}

      {eventoSeleccionado &&
        (eventoSeleccionado.tipo === "RETIRA" ||
        eventoSeleccionado.tipo === "ENTREGA" ? (
          <FichaGestor
            tipo={"llave"}
            elemento={eventoSeleccionado}
            onClose={cerrarModal}
            onGuardar={handleGuardar}
          />
        ) : (
          <FichaGestor
            tipo={AREA}
            filtroVehiculo={AREA}
            elemento={eventoSeleccionado}
            onClose={cerrarModal}
            onGuardar={handleGuardar}
          />
        ))}

      {modalAgregarVisible && (
        <FormGestor
          tipo={AREA}
          filtroVehiculo={AREA} // para que llege como area=furgones por ej
          onClose={cerrarModalAgregar}
          onGuardar={handleGuardar}
        />
      )}

      {modalKeyVisible && (
        <FormLlave
          sector="tractores"
          onClose={cerrarModalKey}
          onGuardar={handleGuardar}
        />
      )}

      {modalTractorVisible && (
        <ModalVehiculo
          coleccion={tractores}
          tipo={"tractores"}
          onClose={cerrarModalTractor}
        />
      )}

      {modalFurgonVisible && (
        <ModalVehiculo
          coleccion={furgones}
          tipo={"furgones"}
          onClose={cerrarModalFurgon}
        />
      )}

      {modalStockVisible && (
        <ModalStock taller={AREA} onClose={cerrarModalStock} />
      )}

      {modalIngresosVisible && (
        <ModalEventos
          tipo="STOCK"
          filtroSector={AREA}
          onClose={cerrarModalIngresos}
        />
      )}

      <div className="table-options">
        <div className="table-options-group">
          {AREA === "tractores" ? (
            <button
              className="table-agregar"
              onClick={() => setModalTractorVisible(true)}
            >
              <img src={LogoTractor} alt="" className="table-logo2" />
              <span className="table-logo-span">Tractores</span>
            </button>
          ) : AREA === "furgones" ? (
            <button
              className="table-agregar"
              onClick={() => setModalFurgonVisible(true)}
            >
              <img src={LogoFurgon} alt="" className="table-logo2" />
              <span className="table-logo-span">Furgones</span>
            </button>
          ) : null}
          <button
            className="table-agregar"
            onClick={() => setModalStockVisible(true)}
          >
            <img src={LogoStock} alt="" className="table-logo2" />
            <span className="table-logo-span">Repuestos</span>
          </button>
        </div>
        <div className="table-options-group">
          {filtroSector === "tractores" && (
            <button
              className="table-agregar"
              onClick={() => setModalKeyVisible(true)}
            >
              <LogoKey className="button-logo" />
            </button>
          )}
          <TextButton
            doble={true}
            text="AGREGAR"
            text2="TRABAJO"
            onClick={() => setModalAgregarVisible(true)}
          />
        </div>
      </div>
    </section>
  );
};

export default Reparaciones;

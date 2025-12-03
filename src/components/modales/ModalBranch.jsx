// ----------------------------------------------------------------------- imports externos
import { useState, useMemo, useEffect } from "react";

// ----------------------------------------------------------------------- imports INTERNOS
import { useData } from "../../context/DataContext";
import TablaColeccion from "../tablas/TablaColeccion";
import FichaVehiculo from "../fichas/FichaVehiculo";
import "./css/Modales.css";

const ModalBranch = ({ sucursalId, onClose }) => {
  const [filtro, setFiltro] = useState("");
  const [activeTab, setActiveTab] = useState("llaves"); // default tab
  const { ubicaciones, tractores, furgones } = useData();
  const [cantTractores, setCantTractores] = useState(0);
  const [cantFurgones, setCantFurgones] = useState(0);
  const [cantLlaves, setCantLlaves] = useState(0);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);

  console.log("ID recibido:", sucursalId);
  console.log("Ubicaciones:", ubicaciones);

  // --- Obtener datos de la sucursal
  const sucursalData = useMemo(() => {
    return (
      ubicaciones.find((s) => s.id === sucursalId) || {
        llaves: [],
        ["llaves-taller-tractores"]: [],
        tractores: [],
        furgones: [],
      }
    );
  }, [ubicaciones, sucursalId]);

  const llavesSucursal = useMemo(() => {
    if (!sucursalData) return [];

    const llavesPorteria = (sucursalData.llaves || []).map((num) => ({
      interno: num,
      dominio: tractores.find((t) => t.interno === num)?.dominio || "-",
      ubicacion: "Porteria",
    }));

    const llavesTaller = (sucursalData["llaves-taller-tractores"] || []).map(
      (num) => ({
        interno: num,
        dominio: tractores.find((t) => t.id === num)?.dominio || "-",
        ubicacion: "Taller Tractores",
      })
    );

    return [...llavesPorteria, ...llavesTaller];
  }, [sucursalData, tractores]);

  const tractoresSucursal = useMemo(
    () =>
      sucursalData.tractores.map((num) => {
        const tractor = tractores.find((t) => t.interno === num);
        return { interno: num, dominio: tractor?.dominio || "-" };
      }),
    [sucursalData, tractores]
  );

  const furgonesSucursal = useMemo(
    () =>
      sucursalData.furgones.map((num) => {
        const furgon = furgones.find((f) => f.interno === num);
        return { interno: num, dominio: furgon?.dominio || "-" };
      }),
    [sucursalData, furgones]
  );

  useEffect(() => {
    setCantLlaves(llavesSucursal.length);
    setCantTractores(tractoresSucursal.length);
    setCantFurgones(furgonesSucursal.length);
  }, [llavesSucursal, tractoresSucursal, furgonesSucursal]);

  // --- Columnas para cada tipo
  const columnasLlaves = [
    { titulo: "INT", campo: "interno" },
    {
      titulo: "DOMINIO",
      campo: "id",
      render: (valor, item) => {
        const tractor = tractores.find((t) => t.interno === item.interno);
        return tractor ? tractor.dominio : "-";
      },
      offresponsive: true,
    },
    { titulo: "UBICACIÓN", campo: "ubicacion", render: (u) => u.toUpperCase() },
  ];

  const columnasTractores = [
    { titulo: "INT", campo: "interno" },
    {
      titulo: "DOMINIO",
      campo: "interno",
      render: (valor, item) => {
        const tractor = tractores.find((t) => t.interno === item.interno);
        return tractor ? tractor.dominio : "-";
      },
    },
  ];

  const columnasFurgones = [
    { titulo: "INT", campo: "interno" },
    {
      titulo: "DOMINIO",
      campo: "id",
      render: (valor, item) => {
        const furgon = furgones.find((f) => f.interno === item.interno);
        return furgon ? furgon.dominio : "-";
      },
    },
  ];

  const datosActivos = useMemo(() => {
    let datos = [];
    if (activeTab === "llaves") datos = llavesSucursal;
    else if (activeTab === "tractores") datos = tractoresSucursal;
    else if (activeTab === "furgones") datos = furgonesSucursal;

    if (!filtro) return datos;

    return datos.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(filtro.toLowerCase())
    );
  }, [activeTab, llavesSucursal, tractoresSucursal, furgonesSucursal, filtro]);

  // --- Columnas activas según tab
  const columnasActivas = useMemo(() => {
    if (activeTab === "llaves") return columnasLlaves;
    if (activeTab === "tractores") return columnasTractores;
    if (activeTab === "furgones") return columnasFurgones;
    return [];
  }, [activeTab]);

  if (!sucursalId) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <h1 className="modal-title">
            <strong>{sucursalData.nombre}</strong>
          </h1>
          <hr />
          <input
            type="text"
            placeholder="Filtrar vehículos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="modal-input-filtro"
          />
        </div>

        <div className="type-container-small">
          <button
            type="button"
            className={
              activeTab === "llaves"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => {
              setActiveTab("llaves");
              setTipoSeleccionado(null);
            }}
          >
            Llaves ({cantLlaves})
          </button>
          <button
            className={
              activeTab === "tractores"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => {
              setActiveTab("tractores");
              setTipoSeleccionado("tractores");
            }}
          >
            Tractores ({cantTractores})
          </button>
          <button
            className={
              activeTab === "furgones"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => {
              setActiveTab("furgones");
              setTipoSeleccionado("furgones");
            }}
          >
            Furgones ({cantFurgones})
          </button>
        </div>

        <TablaColeccion
          columnas={columnasActivas}
          datos={datosActivos}
          onRowClick={(i) => {
            setItemSeleccionado(i);
            setModalVehiculoVisible(true);
          }}
        />

        {/*  Abre la ficha solo con id (no trae el resto de la info)
        {modalVehiculoVisible && (
          <FichaVehiculo
            elemento={itemSeleccionado}
            tipoVehiculo={tipoSeleccionado}
            onClose={() => setModalVehiculoVisible(false)}
          />
        )} 
         */}
      </div>
    </div>
  );
};

export default ModalBranch;

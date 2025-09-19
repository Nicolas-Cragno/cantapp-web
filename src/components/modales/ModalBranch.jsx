// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import { useData } from "../../context/DataContext";
import TablaColeccion from "../tablas/TablaColeccion";
import "./css/Modales.css";

const ModalBranch = ({ sucursalId, onClose }) => {
  const [filtro, setFiltro] = useState("");
  const [activeTab, setActiveTab] = useState("llaves"); // default tab
  const { ubicaciones, tractores, furgones } = useData();

  // --- Obtener datos de la sucursal
  const sucursalData = useMemo(() => {
    return (
      ubicaciones[sucursalId] || { llaves: [], tractores: [], furgones: [] }
    );
  }, [ubicaciones, sucursalId]);

  const llavesSucursal = useMemo(
    () =>
      sucursalData.llaves.map((num) => {
        const tractor = tractores.find((t) => t.interno === num);
        return { interno: num, dominio: tractor?.dominio || "-" };
      }),
    [sucursalData, tractores]
  );

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

  // --- Columnas para cada tipo
  const columnasLlaves = [
    { titulo: "ID", campo: "interno" },
    {
      titulo: "DOMINIO",
      campo: "id",
      render: (valor, item) => {
        const tractor = tractores.find((t) => t.interno === item.interno);
        return tractor ? tractor.dominio : "-";
      },
    },
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
    { titulo: "ID", campo: "interno" },
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
            onClick={() => setActiveTab("llaves")}
          >
            Llaves
          </button>
          <button
            className={
              activeTab === "tractores"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => setActiveTab("tractores")}
          >
            Tractores
          </button>
          <button
            className={
              activeTab === "furgones"
                ? "type-btn positive-active-black"
                : "type-btn"
            }
            onClick={() => setActiveTab("furgones")}
          >
            Furgones
          </button>
        </div>

        <TablaColeccion columnas={columnasActivas} datos={datosActivos} />
      </div>
    </div>
  );
};

export default ModalBranch;

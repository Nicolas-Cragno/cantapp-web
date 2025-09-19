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
    () => sucursalData.llaves.map((num) => ({ id: num })),
    [sucursalData]
  );

  const tractoresSucursal = useMemo(
    () => sucursalData.tractores.map((num) => ({ interno: num })),
    [sucursalData]
  );

  const furgonesSucursal = useMemo(
    () => sucursalData.furgones.map((num) => ({ id: num })),
    [sucursalData]
  );

  // --- Columnas para cada tipo
  const columnasLlaves = [
    { titulo: "ID", campo: "id" },
    {
      titulo: "DOMINIO",
      campo: "id",
      render: (valor, item) => {
        const tractor = tractores.find((t) => t.interno === item.id);
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
    { titulo: "ID", campo: "id" },
    {
      titulo: "DOMINIO",
      campo: "id",
      render: (valor, item) => {
        const furgon = furgones.find((f) => f.interno === item.id);
        return furgon ? furgon.dominio : "-";
      },
    },
  ];

  // --- Datos filtrados según tab y búsqueda
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

        <h2>BASE {sucursalData.nombre}</h2>

        <hr />

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <button
            className={activeTab === "llaves" ? "tab-active" : ""}
            onClick={() => setActiveTab("llaves")}
          >
            Llaves
          </button>
          <button
            className={activeTab === "tractores" ? "tab-active" : ""}
            onClick={() => setActiveTab("tractores")}
          >
            Tractores
          </button>
          <button
            className={activeTab === "furgones" ? "tab-active" : ""}
            onClick={() => setActiveTab("furgones")}
          >
            Furgones
          </button>
        </div>

        {/* Filtro */}
        <input
          type="text"
          placeholder="Filtrar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="modal-input-filtro"
        />

        {/* Tabla */}
        <TablaColeccion columnas={columnasActivas} datos={datosActivos} />
      </div>
    </div>
  );
};

export default ModalBranch;

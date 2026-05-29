/// PARA SALIR DEL PASO, FULL CHATGPT

// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";

// ----------------------------------------------------------------------- internos
import useAsignaciones from "../../context/hooks/useAsignaciones";

import TablaColeccion from "../tablas/TablaColeccion";
import FichaEventosGestor from "../fichas/FichaEventosGestor";
import FormHerramienta from "../forms/FormHerramienta";

import "./css/Modales.css";

const ModalAsignaciones = ({ onRowClick = null, onClose }) => {
  const [filtro, setFiltro] = useState("");

  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);

  const [modalFichaVisible, setModalFichaVisible] = useState(false);

  const [modalAsignacionVisible, setModalAsignacionVisible] = useState(false);

  // ------------------------------------------------ data

  const { asignaciones, loading } = useAsignaciones();

  // ------------------------------------------------ columnas

  const columnas = [
    {
      titulo: "ID",
      campo: "id",
    },

    {
      titulo: "FECHA",
      campo: "fechaFormateada",
      render: (v, as) => `${as.fechaFormateada} - ${as.horaFormateada} hs`,
    },

    {
      titulo: "PERSONA",
      campo: "nombrePersona",
    },

    {
      titulo: "ARTÍCULO",
      campo: "nombreArticulo",
    },

    {
      titulo: "CANTIDAD",
      campo: "cantidadFull",
    },

    {
      titulo: "ÁREA",
      campo: "area",
      render: (a) => a?.toUpperCase(),
    },

    {
      titulo: "CARGA",
      campo: "usuario",
      render: (u) => u?.toUpperCase(),
    },
  ];

  // ------------------------------------------------ filtros

  const asignacionesFiltradas = useMemo(() => {
    return (asignaciones || []).filter((as) =>
      as.searchText.includes(filtro.toLowerCase()),
    );
  }, [asignaciones, filtro]);

  // ------------------------------------------------ handlers

  const cerrarModalFicha = () => {
    setModalFichaVisible(false);
  };

  const handleGuardar = async () => {
    setModalFichaVisible(false);
    setAsignacionSeleccionada(null);
  };

  // ------------------------------------------------ render

  return (
    <div className="modal">
      <div className="modal-content-2">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <h1 className="modal-title">
            <strong>HERRAMIENTAS ASIGNADAS</strong>
          </h1>

          <div className="modal-input-filtro">
            <label className="modal-label">FILTRO</label>

            <input
              type="text"
              placeholder="..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>

        <TablaColeccion
          columnas={columnas}
          datos={asignacionesFiltradas}
          loading={loading}
          onRowClick={(asignacion) => {
            if (onRowClick) {
              onRowClick(asignacion);
              return;
            }

            setAsignacionSeleccionada(asignacion);
            setModalFichaVisible(true);
          }}
        />

        <div className="table-options-group modal-footer2">
          <button
            className="table-agregar"
            onClick={() => setModalAsignacionVisible(true)}
          >
            + NUEVA ASIGNACIÓN
          </button>
        </div>

        {modalAsignacionVisible && (
          <FormHerramienta
            onGuardar={() => setModalAsignacionVisible(false)}
            onClose={() => setModalAsignacionVisible(false)}
          />
        )}

        {modalFichaVisible && (
          <FichaEventosGestor
            tipo={"asignaciones"}
            elemento={asignacionSeleccionada}
            onClose={cerrarModalFicha}
            onGuardar={handleGuardar}
          />
        )}
      </div>
    </div>
  );
};

export default ModalAsignaciones;

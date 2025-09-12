// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { buscarPersona } from "../../functions/dataFunctions";
import TablaColeccion from "../tablas/TablaColeccion";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";
import FichaPersonal from "../fichas/FichaPersonal";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Modales.css";

const ModalPersona = ({ puesto = null, onClose }) => {
  const [filtro, setFiltro] = useState("");
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const { personas } = useData();

  const columnasPersona = [
    {
      titulo: "DNI",
      campo: "dni",
    },
    {
      titulo: "NOMBRE",
      campo: "dni",
      render: (dni) => buscarPersona(personas, dni),
    },
    {
      titulo: "PUESTO",
      campo: "puesto",
    },
    {
      titulo: "EMPRESA",
      campo: "empresa",
      render: (e) => <LogoEmpresaTxt cuitEmpresa={e} completo={false} />,
    },
  ];

  const cerrarModalFicha = () => {
    setModalFichaVisible(false);
  };

  const personasFiltradas = useMemo(() => {
    let datos = puesto
      ? personas.filter((p) => p.puesto.toUpperCase() === puesto.toUpperCase())
      : personas;

    if (filtro) {
      datos = datos.filter((p) => {
        const texto =
          `${p.apellido} ${p.nombres} ${p.dni} ${p.puesto}`.toLowerCase();
        return texto.includes(filtro.toLowerCase());
      });
    }

    return [...datos].sort((a, b) => a.apellido.localeCompare(b.apellido));
  }, [personas, puesto, filtro]);

  return (
    <div className="modal">
      <div className="modal-content-2">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <h1 className="modal-title">
            <strong>
              {puesto ? puesto.toUpperCase() : "LISTADO DE PERSONAS"}
            </strong>
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
          columnas={columnasPersona}
          datos={personasFiltradas}
          onRowClick={(persona) => {
            setPersonaSeleccionada(persona);
            setModalFichaVisible(true);
          }}
        />

        {modalFichaVisible && (
          <FichaPersonal
            persona={personaSeleccionada}
            onClose={cerrarModalFicha}
          />
        )}
      </div>
    </div>
  );
};

export default ModalPersona;

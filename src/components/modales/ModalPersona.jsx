// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";
import {
  BsPersonDash as LogoDash,
  BsPersonCheck as LogoCheck,
  BsPersonPlusFill as LogoPlus,
} from "react-icons/bs";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { buscarPersona } from "../../functions/dataFunctions";
import TablaColeccion from "../tablas/TablaColeccion";
import FichaGestor from "../fichas/FichaGestor";
import FormPersona from "../forms/FormPersona";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";
import "./css/Modales.css";

const ModalPersona = ({ puesto = null, onClose }) => {
  const filtroPuesto = puesto ? String(puesto).toUpperCase() : null;
  const [filtro, setFiltro] = useState("");
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [modalFichaVisible, setModalFichaVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
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

      offresponsive: true,
    },
    {
      titulo: "EMPRESA",
      campo: "empresa",
      render: (e) => <LogoEmpresaTxt cuitEmpresa={e} completo={false} />,
      offresponsive: true,
    },
    {
      titulo: "",
      campo: "estado",
      render: (e) =>
        e === true ? (
          <LogoCheck className="logoestado logo-active" />
        ) : (
          <LogoDash className="logoestado logo-disabled" />
        ),
      offresponsive: true,
    },
  ];

  const cerrarModalFicha = () => {
    setModalFichaVisible(false);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
  };

  const handleGuardar = async () => {
    setModalFichaVisible(false);
    setPersonaSeleccionada(null);
  };

  const personasFiltradas = useMemo(() => {
    let datos = filtroPuesto
      ? personas.filter(
          (p) =>
            (p.puesto === filtroPuesto || p.especializacion === filtroPuesto) &&
            (p.estado === 1 || p.estado)
        )
      : personas;

    if (filtro) {
      datos = datos.filter((p) => {
        const estado = p.estado ? "activo" : "inactivo";
        const texto =
          `${p.apellido} ${p.nombres} ${p.dni} ${p.puesto} ${p.especializacion} ${estado}`.toLowerCase();
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

        <div className="ficha-buttons">
          <button onClick={() => setModalAgregarVisible(true)}>
            <LogoPlus size={26} />
          </button>
        </div>

        {modalFichaVisible && (
          <FichaGestor
            tipo="personal"
            elemento={personaSeleccionada}
            onClose={cerrarModalFicha}
            onGuardar={handleGuardar}
          />
        )}

        {modalAgregarVisible && <FormPersona onClose={cerrarModalAgregar} />}
      </div>
    </div>
  );
};

export default ModalPersona;

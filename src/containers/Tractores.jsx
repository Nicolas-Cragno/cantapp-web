// ----------------------------------------------------------------------- imports externos
import { useState } from "react";

// ----------------------------------------------------------------------- imports internos
import "./css/Sections.css";
// formularios y modales
import FormGestor from "../components/forms/FormGestor";
import FormLlave from "../components/forms/FormLlave";
import FormToDoList from "../components/forms/FormToDoList";
import ModalVehiculo from "../components/modales/ModalVehiculo";
import ModalStock from "../components/modales/ModalStock";
import ModalEventos from "../components/modales/ModalEventos";
import ModalPersona from "../components/modales/ModalPersona";
import ModalProveedor from "../components/modales/ModalProveedor";
import ModalPendientes from "../components/modales/ModalPendientes";
// elementos
import CardLogo from "../components/cards/CardLogo";
import ListLogo from "../assets/logos/listLogo.png";
import PlusLogo from "../assets/logos/plusLogo-w.png";
import KeyLogo from "../assets/logos/keylogo.png";
import LogoCheck from "../assets/logos/oklogo.png";
import LogoInOut from "../assets/logos/inOutLogo.png";
import LogoTractor from "../assets/logos/logotractor-w.png";
import LogoStock from "../assets/logos/logostock-w.png";
import LogoPersona from "../assets/logos/logopersonal-w.png";

// ----------------------------------------------------------------------- data
import { useData } from "../context/DataContext";

const Tractores = () => {
  const AREA = "tractores";
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalEventosVisible, setModalEventosVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalIngresosVisible, setModalIngresosVisible] = useState(false);
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);
  const [modalPendientesVisible, setModalPendientesVisible] = useState(false);
  const [modalToDoListVisible, setModalToDoListVisible] = useState(false);
  const { tractores } = useData();

  return (
    <section className="section-containers">
      <div className="section-banner banner-tractores">
        <div className="banner-footer">
          <h1 className="section-logo-box">
            <img src={LogoTractor} alt="" className="section-logo" />
            TALLER {AREA.toUpperCase()}
          </h1>
        </div>
      </div>
      <div className="section-options">
        {modalAgregarVisible && (
          <FormGestor
            tipo={AREA}
            filtroVehiculo={AREA}
            onClose={() => setModalAgregarVisible(false)}
            onGuardar={() => setModalAgregarVisible(false)}
          />
        )}
        {modalToDoListVisible && (
          <FormToDoList
            onClose={() => setModalToDoListVisible(false)}
            onGuardar={() => setModalToDoListVisible(false)}
          />
        )}
        {modalPendientesVisible && (
          <ModalPendientes
            filtroSector={"tractores"}
            onClose={() => setModalPendientesVisible(false)}
          />
        )}
        {modalKeyVisible && (
          <FormLlave
            sector={AREA}
            onClose={() => setModalKeyVisible(false)}
            onGuardar={() => setModalKeyVisible(false)}
          />
        )}
        {modalEventosVisible && (
          <ModalEventos
            filtroSector={AREA}
            onClose={() => setModalEventosVisible(false)}
          />
        )}
        {modalTractorVisible && (
          <ModalVehiculo
            coleccion={tractores}
            tipo={AREA}
            onClose={() => setModalTractorVisible(false)}
          />
        )}
        {modalStockVisible && (
          <ModalStock
            taller={AREA}
            onClose={() => setModalStockVisible(false)}
          />
        )}
        {modalProveedorVisible && (
          <ModalProveedor onClose={() => setModalProveedorVisible(false)} />
        )}
        {modalPersonaVisible && (
          <ModalPersona
            puesto="mecanico"
            onClose={() => setModalPersonaVisible(false)}
          />
        )}
        {modalIngresosVisible && (
          <ModalEventos
            tipo="STOCK"
            //filtroSector={AREA}
            onClose={() => setModalIngresosVisible(false)}
          />
        )}
        <div className="table-options-group">
          <div className="sections-options-row">
            {/*
              <CardLogo
              title="Programar"
              logo={PlusLogo}
              onClick={() => setModalToDoListVisible(true)}
            />
              */}
            <CardLogo
              title="Pendientes"
              logo={ListLogo}
              onClick={() => setModalPendientesVisible(true)}
            />
            <CardLogo
              title="Nuevo Trabajo"
              logo={PlusLogo}
              onClick={() => setModalAgregarVisible(true)}
            />
            <CardLogo
              title="Historial Trabajos"
              logo={ListLogo}
              onClick={() => setModalEventosVisible(true)}
            />
            <CardLogo
              title="Ingresos"
              logo={LogoInOut}
              onClick={() => setModalIngresosVisible(true)}
            />
            <CardLogo
              title="Registro llaves"
              logo={KeyLogo}
              onClick={() => setModalKeyVisible(true)}
            />
          </div>

          <div className="sections-options-row">
            <CardLogo
              title="Tractores"
              logo={LogoTractor}
              onClick={() => setModalTractorVisible(true)}
            />
            <CardLogo
              title="Mecanicos"
              logo={LogoPersona}
              onClick={() => setModalPersonaVisible(true)}
            />
            <CardLogo
              title="Repuestos"
              logo={LogoStock}
              onClick={() => setModalStockVisible(true)}
            />
          </div>
          <div className="section-options-row"></div>
        </div>
      </div>
      {/*
      <Reparaciones filtroSector="tractores"></Reparaciones>
      */}
    </section>
  );
};

export default Tractores;

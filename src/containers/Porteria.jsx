// ----------------------------------------------------------------------- imports externos
import { useState } from "react";

// ----------------------------------------------------------------------- imports internos
import "./css/Sections.css";
// formularios y modales
import FormGestor from "../components/forms/FormGestor";
import FormLlave from "../components/forms/FormLlave";
import ModalVehiculo from "../components/modales/ModalVehiculo";
import ModalStock from "../components/modales/ModalStock";
import ModalEventos from "../components/modales/ModalEventos";
import ModalPersona from "../components/modales/ModalPersona";
import ModalProveedor from "../components/modales/ModalProveedor";
// elementos
import LogoPorteria from "../assets/logos/logoporteria-w.png";
import LogoTractor from "../assets/logos/logotractor-w.png";
import LogoFurgon from "../assets/logos/logofurgon-w.png";
import LogoPersona from "../assets/logos/logopersonal-w.png";
import LogoAuto from "../assets/logos/logoutilitario-w.png";
import CardLogo from "../components/cards/CardLogo";
import ListLogo from "../assets/logos/listLogo.png";
import PlusLogo from "../assets/logos/plusLogo-w.png";
import KeyLogo from "../assets/logos/keylogo.png";
import LogoInOut from "../assets/logos/inOutLogo.png";
import LogoStock from "../assets/logos/logostock-w.png";

// ----------------------------------------------------------------------- data
import { useData } from "../context/DataContext";

const Porteria = () => {
  const AREA = "porteria";
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
  const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
  const [modalVehiculoVisible, setModalVehiculoVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalEventosVisible, setModalEventosVisible] = useState(false);
  const [modalKeyVisible, setModalKeyVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);
  const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
  const [modalIngresosVisible, setModalIngresosVisible] = useState(false);
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);
  const { tractores, vehiculos, furgones } = useData();

  return (
    <section className="section-containers">
      <div className="section-banner banner-porteria">
        <div className="banner-footer">
          <h1 className="section-logo-box">
            <img src={LogoPorteria} alt="" className="section-logo" />
            {AREA.toUpperCase()}
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
        {modalEventosVisible && (
          <ModalEventos
            filtroSector={AREA}
            onClose={() => setModalEventosVisible(false)}
          />
        )}
        {modalVehiculoVisible && (
          <ModalVehiculo
            coleccion={vehiculos}
            tipo={"vehiculos"}
            onClose={() => setModalVehiculoVisible(false)}
          />
        )}
        {modalTractorVisible && (
          <ModalVehiculo
            coleccion={tractores}
            tipo={"tractores"}
            onClose={() => setModalTractorVisible(false)}
          />
        )}
        {modalFurgonVisible && (
          <ModalVehiculo
            coleccion={furgones}
            tipo={"furgones"}
            onClose={() => setModalFurgonVisible(false)}
          />
        )}
        {modalAgregarVisible && (
          <FormGestor
            tipo={AREA}
            onClose={() => setModalAgregarVisible(false)}
            onGuardar={() => setModalAgregarVisible(false)}
          />
        )}
        {modalKeyVisible && (
          <FormLlave
            sector={AREA}
            onClose={() => setModalKeyVisible(false)}
            onGuardar={() => setModalKeyVisible(false)}
          />
        )}
        {modalPersonaVisible && (
          <ModalPersona onClose={() => setModalPersonaVisible(false)} />
        )}
        <div className="table-options-group">
          <div className="sections-options-row">
            <CardLogo
              title="Nuevo evento"
              logo={PlusLogo}
              onClick={() => setModalAgregarVisible(true)}
            />
            <CardLogo
              title="Historial"
              logo={ListLogo}
              onClick={() => setModalEventosVisible(true)}
            />
            <CardLogo
              title="Registro llaves"
              logo={KeyLogo}
              onClick={() => setModalKeyVisible(true)}
            />
          </div>

          <div className="sections-options-row">
            <CardLogo
              title="Vehiculos"
              logo={LogoAuto}
              onClick={() => setModalVehiculoVisible(true)}
            />
            <CardLogo
              title="Tractores"
              logo={LogoTractor}
              onClick={() => setModalTractorVisible(true)}
            />
            <CardLogo
              title="Furgones"
              logo={LogoFurgon}
              onClick={() => setModalFurgonVisible(true)}
            />
            <CardLogo
              title="Personas"
              logo={LogoPersona}
              onClick={() => setModalPersonaVisible(true)}
            />
          </div>
        </div>
      </div>
      {/*
      <Reparaciones filtroSector="tractores"></Reparaciones>
      */}
    </section>
  );
};

export default Porteria;

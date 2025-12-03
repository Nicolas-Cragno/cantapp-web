import Reparaciones from "./sub-containers/Reparaciones";
import { useEffect, useState } from "react";
import { FaKey as LogoKey } from "react-icons/fa";
import FormGestor from "../components/forms/FormGestor";
import FormLlave from "../components/forms/FormLlave";
import TextButton from "../components/buttons/TextButton";
import CardLogo from "../components/cards/CardLogo";
import LogoRepair from "../assets/logos/repairLogo.png";
import ListLogo from "../assets/logos/listLogo.png";
import PlusLogo from "../assets/logos/plusLogo-w.png";
import KeyLogo from "../assets/logos/keylogo.png";
import LogoInOut from "../assets/logos/inOutLogo.png";
import LogoRm from "../assets/logos/rmlogo.png";
import LogoPlus from "../assets/logos/tripoilLogo.png";
import "./css/Sections.css";
import FullButton from "../components/buttons/FullButton";
import ModalVehiculo from "../components/modales/ModalVehiculo";
import LogoTractor from "../assets/logos/logotractor-w.png";
import LogoFurgon from "../assets/logos/logopuertafurgon.png";
import LogoDefault from "../assets/logos/logo.svg";
import LogoStock from "../assets/logos/logostock-w.png";
import LogoProveedor from "../assets/logos/logoproveedor-grey.png";
import LogoPersona from "../assets/logos/logopersonal-w.png";
import ModalStock from "../components/modales/ModalStock";
import ModalEventos from "../components/modales/ModalEventos";
import ModalPersona from "../components/modales/ModalPersona";
import ModalProveedor from "../components/modales/ModalProveedor";
import { useData } from "../context/DataContext";

const Tractores = () => {
  const AREA = "tractores";
  const [modalTractorVisible, setModalTractorVisible] = useState(false);
    const [modalFurgonVisible, setModalFurgonVisible] = useState(false);
    const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
    const [modalEventosVisible, setModalEventosVisible] = useState(false);
    const [modalKeyVisible, setModalKeyVisible] = useState(false);
    const [modalStockVisible, setModalStockVisible] = useState(false);
    const [modalPersonaVisible, setModalPersonaVisible] = useState(false);
    const [modalIngresosVisible, setModalIngresosVisible] = useState(false);
    const [modalProveedorVisible, setModalProveedorVisible] = useState(false);

    const {tractores } = useData();
    
  return (
    <section className="section-containers">
      <div className="section-banner">
        a
      </div>
      <div className="section-options">
        {modalAgregarVisible && (
                <FormGestor
                  tipo={AREA}
                  filtroVehiculo={AREA}
                  onClose={() => setModalAgregarVisible(false)}
                  onGuardar={()=> setModalAgregarVisible(false)}
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
                <ModalEventos filtroSector={"tractores"} onClose={()=> setModalEventosVisible(false)}/>
              )}
              {modalTractorVisible && (
                <ModalVehiculo
                  coleccion={tractores}
                  tipo={AREA}
                  onClose={() => setModalTractorVisible(false)}
                />
              )}
              {modalStockVisible && (
                <ModalStock taller={AREA} onClose={() => setModalStockVisible(false)} />
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
                  filtroSector={AREA}
                  onClose={() => setModalIngresosVisible(false)}
                />
              )}
        <div className="table-options-group">
       <div className="sections-options-row">
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
        </div>
       
      </div>
      {/*
      <Reparaciones filtroSector="tractores"></Reparaciones>
      */}
    </section>
  );
};

export default Tractores;

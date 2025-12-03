// ----------------------------------------------------------------------- imports externos
import { useState } from "react";

// ----------------------------------------------------------------------- imports internos
import "./css/Sections.css";
// formularios y modales
import FormGestor from "../components/forms/FormGestor";
import FichaStock from "../components/fichas/FichaStock";
import LogoProveedor from "../assets/logos/logoproveedor-grey.png";
import FormStock from "../components/forms/FormStock";
import FormRemito from "../components/forms/FormRemito";
import FormFactura from "../components/forms/FormFactura";
import FormHerramienta from "../components/forms/FormHerramienta";
import FormMovimientoStock from "../components/forms/FormMovimientoStock";
import LogoRemito from "../assets/logos/rmlogo.png";
import LogoFactura from "../assets/logos/fclogo.png";
import LogoTool from "../assets/logos/logoasignacion.png";
import LogoMovStock from "../assets/logos/inOutLogo.png";
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

const Stock = () => {
  const AREA = "stock";
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);
  const [modalEventosVisible, setModalEventosVisible] = useState(false);
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false);
  const [modalRemitoVisible, setModalRemitoVisible] = useState(false);
  const [modalFacturaVisible, setModalFacturaVisible] = useState(false);
  const [modalStockVisible, setModalStockVisible] = useState(false);
  const [modalHerramientasVisible, setModalHerramientasVisible] =
    useState(false);

  const { stock = [], proveedores = [] } = useData();
  const loading = !stock || stock.length === 0;

  return (
    <section className="section-containers">
      <div className="section-banner banner-stock">
        <div className="banner-footer">
          <h1 className="section-logo-box">
            <img src={LogoPorteria} alt="" className="section-logo" />
            {AREA.toUpperCase()}
          </h1>
        </div>
      </div>
      <div className="section-options">
        {modalStockVisible && (
          <ModalStock onClose={() => setModalStockVisible(false)} />
        )}
        {modalAgregarVisible && (
          <FormGestor
            tipo={AREA}
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
        {modalAgregarVisible && (
          <FormStock
            onClose={() => setModalAgregarVisible(false)}
            onGuardar={() => setModalAgregarVisible(false)}
          />
        )}
        {modalMovimientoVisible && (
          <FormMovimientoStock
            onClose={() => setModalMovimientoVisible(false)}
            onGuardar={() => setModalMovimientoVisible(false)}
          />
        )}
        {modalHerramientasVisible && (
          <FormHerramienta
            //sector={taller}
            onClose={() => setModalHerramientasVisible(false)}
            onGuardar={() => setModalHerramientasVisible(false)}
          />
        )}
        {modalEventosVisible && (
          <ModalEventos
            tipo="STOCK"
            onClose={() => setModalEventosVisible(false)}
          />
        )}
        {modalProveedorVisible && (
          <ModalProveedor onClose={() => setModalProveedorVisible(false)} />
        )}
        {modalRemitoVisible && (
          <FormRemito onClose={() => setModalRemitoVisible(false)} />
        )}
        {modalFacturaVisible && (
          <FormFactura onClose={() => setModalFacturaVisible(false)} />
        )}
        <div className="table-options-group">
          <div className="sections-options-row">
            <CardLogo
              title="Repuestos & Herramientas"
              logo={LogoStock}
              onClick={() => setModalStockVisible(true)}
            />
            <CardLogo
              title="Proveedores"
              logo={LogoProveedor}
              onClick={() => setModalProveedorVisible(true)}
            />
            <CardLogo
              title="Historial Ingresos"
              logo={ListLogo}
              onClick={() => setModalEventosVisible(true)}
            />
            {/*
             */}
          </div>
          <div className="sections-options-row">
            <CardLogo
              title="Asignar Herramienta"
              logo={LogoTool}
              onClick={() => setModalHerramientasVisible(true)}
            />
            <CardLogo
              title="Cargar Remito"
              logo={LogoRemito}
              onClick={() => setModalRemitoVisible(true)}
            />
            <CardLogo
              title="Cargar Factura"
              logo={LogoFactura}
              onClick={() => setModalFacturaVisible(true)}
            />
            <CardLogo
              title="Ajuste Stock"
              logo={LogoMovStock}
              onClick={() => setModalMovimientoVisible(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stock;

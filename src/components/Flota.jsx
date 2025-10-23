// ----------------------------------------------------------------------- imports externos
import { useEffect, useState } from "react";
import { FaSpinner as LogoLoading } from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../context/DataContext";
import ModalPersona from "./modales/ModalPersona";
import ModalVehiculo from "./modales/ModalVehiculo";
import Card from "./cards/Card";
import "./css/GroupCards.css";

const Flota = () => {
  const { tractores, furgones, vehiculos, personas } = useData();
  const [cantPersonas, setPersonas] = useState(0);
  const [cantTractores, setTractores] = useState(0);
  const [cantFurgones, setFurgones] = useState(0);
  const [cantVehiculos, setVehiculos] = useState(0);
  const [modalTractoresVisible, setModalTractoresVisible] = useState(false);
  const [modalFurgonesVisible, setModalFurgonesVisible] = useState(false);
  const [modalVehiculosVisible, setModalVehiculosVisible] = useState(false);
  const [modalPersonasVisible, setModalPersonasVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        setTractores(
          tractores.filter((tr) => tr.estado === true || tr.estado === 1).length
        );
        setFurgones(
          furgones.filter((fg) => fg.estado === true || fg.estado === 1).length
        );
        setVehiculos(
          vehiculos.filter((vh) => vh.estado === true || vh.estado === 1).length
        );
        setPersonas(
          personas.filter((p) => p.estado === true || p.estado === 1).length
        );
      } catch (error) {
        console.error("Error al obtener datos con caché: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const cerrarModalTractores = () => {
    setModalTractoresVisible(false);
  };

  const cerrarModalFurgones = () => {
    setModalFurgonesVisible(false);
  };

  const cerrarModalVehiculos = () => {
    setModalVehiculosVisible(false);
  };

  const cerrarModalPersonas = () => {
    setModalPersonasVisible(false);
  };

  return (
    <div className="container group-card">
      <div className="row">
        <div className="col-md-2 gtitle">
          <h1>FLOTA</h1>
        </div>
        <div className="col-auto gcard">
          <Card
            title="Empleados"
            value={
              loading ? <LogoLoading className="spinner" /> : `${cantPersonas}`
            }
            // route="/personas"
            onClick={() => setModalPersonasVisible(true)}
          />
          <Card
            title="Tractores"
            value={
              loading ? <LogoLoading className="spinner" /> : `${cantTractores}`
            }
            // route="/tractores"
            onClick={() => setModalTractoresVisible(true)}
          />

          <Card
            title="Furgones"
            value={
              loading ? <LogoLoading className="spinner" /> : `${cantFurgones}`
            }
            //route="/furgones"
            onClick={() => setModalFurgonesVisible(true)}
          />
          <Card
            title="Vehiculos"
            value={
              loading ? <LogoLoading className="spinner" /> : `${cantVehiculos}`
            }
            //route="/vehiculos"
            onClick={() => setModalVehiculosVisible(true)}
          />

          <div>
            {modalTractoresVisible && (
              <ModalVehiculo
                coleccion={tractores}
                tipo={"tractores"}
                onClose={cerrarModalTractores}
              />
            )}

            {modalFurgonesVisible && (
              <ModalVehiculo
                coleccion={furgones}
                tipo={"furgones"}
                onClose={cerrarModalFurgones}
              />
            )}

            {modalVehiculosVisible && (
              <ModalVehiculo
                coleccion={vehiculos}
                tipo={"vehiculos"}
                propios={true}
                onClose={cerrarModalVehiculos}
              />
            )}

            {modalPersonasVisible && (
              <ModalPersona onClose={cerrarModalPersonas} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flota;

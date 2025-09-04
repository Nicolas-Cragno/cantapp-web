import "./css/GroupCards.css";
import Card from "../components/cards/Card";
import { useEffect, useState } from "react";
import { listarColeccion } from "../functions/db-functions";
import { FaSpinner } from "react-icons/fa";

const Personal = () => {
  const [cantMecanicos, setCantMecanicos] = useState(0);
  const [cantChoferesLarga, setCantChoferesLarga] = useState(0);
  const [cantChoferesMovimiento, setCantChoferesMovimiento] = useState(0);
  const [cantAdministrativos, setCantAdministrativos] = useState(0);
  const [cantSeguridad, setCantSeguridad] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const personas = await listarColeccion("personas");

        setCantMecanicos(
          personas.filter((p) => p.puesto === "MECANICO" && p.estado === true)
            .length
        );
        setCantChoferesLarga(
          personas.filter(
            (p) => p.puesto === "CHOFER LARGA DISTANCIA" && p.estado === true
          ).length
        );
        setCantChoferesMovimiento(
          personas.filter(
            (p) => p.puesto === "CHOFER MOVIMIENTO" && p.estado === true
          ).length
        );
        setCantAdministrativos(
          personas.filter(
            (p) => p.puesto === "ADMINISTRATIVO" && p.estado === true
          ).length
        );
        setCantSeguridad(
          personas.filter((p) => p.puesto === "VIGILANCIA" && p.estado === true)
            .length
        );
      } catch (error) {
        console.error("Error al obtener datos con caché: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container group-card">
      <div className="row">
        <div className="col-md-2 gtitle">
          <h1>PERSONAL</h1>
        </div>
        <div className="col-auto gcard">
          <Card
            title="Mecánicos"
            value={
              loading ? <FaSpinner className="spinner" /> : `${cantMecanicos}`
            }
            route="/mecanicos"
          />
          <Card
            title="Choferes larga dist."
            value={
              loading ? (
                <FaSpinner className="spinner" />
              ) : (
                `${cantChoferesLarga}`
              )
            }
            route="/choferes-larga"
          />
          <Card
            title="Choferes movimiento"
            value={
              loading ? (
                <FaSpinner className="spinner" />
              ) : (
                `${cantChoferesMovimiento}`
              )
            }
            route="/choferes-movimiento"
          />
          <Card
            title="Administrativo"
            value={
              loading ? (
                <FaSpinner className="spinner" />
              ) : (
                `${cantAdministrativos}`
              )
            }
            route="/administrativos"
          />
          <Card
            title="Seguridad"
            value={
              loading ? <FaSpinner className="spinner" /> : `${cantSeguridad}`
            }
            route="/seguridad"
          />
        </div>
      </div>
    </div>
  );
};

export default Personal;

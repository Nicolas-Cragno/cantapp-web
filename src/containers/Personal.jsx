import "./css/Sections.css";
import Card from "../components/cards/Card";
import { useEffect, useState } from "react";
import { listarColeccion } from "../functions/db-functions";
import { FaSpinner } from "react-icons/fa";

const Personal = () => {
  const [cantMecanicos, setCantMecanicos] = useState(0);
  const [cantChoferesLarga, setCantChoferesLarga] = useState(0);
  const [cantChoferesMovimiento, setCantChoferesMovimiento] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const personas = await listarColeccion("personas");

        setCantMecanicos(
          personas.filter((p) => p.puesto === "MECANICO").length
        );
        setCantChoferesLarga(
          personas.filter((p) => p.puesto === "CHOFER LARGA DISTANCIA").length
        );
        setCantChoferesMovimiento(
          personas.filter((p) => p.puesto === "CHOFER MOVIMIENTO").length
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
    <>
      <Card
        title="Mecánicos"
        value={loading ? <FaSpinner className="spinner" /> : `${cantMecanicos}`}
        route="/mecanicos"
      />
      <Card
        title="Choferes larga dist."
        value={
          loading ? <FaSpinner className="spinner" /> : `${cantChoferesLarga}`
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
    </>
  );
};

export default Personal;

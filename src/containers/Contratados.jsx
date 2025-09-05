import "./css/GroupCards.css";
import Card from "../components/cards/Card";
import { useEffect, useState } from "react";
import { listarColeccion } from "../functions/db-functions";
import { FaSpinner } from "react-icons/fa";

const Contratados = () => {
  const [cantFleteros, setCantFleteros] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const personas = await listarColeccion("personas");

        setCantFleteros(
          personas.filter(
            (p) =>
              (p.puesto === "CHOFER FLETERO" || p.puesto === "FLETERO ") &&
              p.estado === true
          ).length
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
          <h1>CONTRATADOS</h1>
        </div>
        <div className="col-auto gcard">
          <Card
            title="Fleteros"
            value={
              loading ? <FaSpinner className="spinner" /> : `${cantFleteros}`
            }
            route="/fleteros"
          />
        </div>
      </div>
    </div>
  );
};

export default Contratados;

import "./css/Sections.css";
import Card from "../components/cards/Card";
import { useEffect, useState } from "react";
import { listarColeccion } from "../functions/db-functions";
import { FaSpinner } from "react-icons/fa";

const Flota = () => {
  const [cantTractores, setTractores] = useState(0);
  const [cantFurgones, setFurgones] = useState(0);
  const [cantUtilitarios, setUtilitarios] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [tractores, furgones, utilitarios] = await Promise.all([
          listarColeccion("tractores"),
          listarColeccion("furgones"),
          listarColeccion("utilitarios"),
        ]);

        setTractores(
          tractores.filter((tr) => tr.estado === true || tr.estado === 1).length
        );
        setFurgones(
          furgones.filter((fg) => fg.estado === true || fg.estado === 1).length
        );
        setUtilitarios(
          utilitarios.filter((ut) => ut.estado === true || ut.estado === 1)
            .length
        );
      } catch (error) {
        console.error("Error al obtener datos con caché: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <>
      <Card
        title="Tractores"
        value={loading ? <FaSpinner className="spinner" /> : `${cantTractores}`}
        route="/tractores"
      />
      <Card
        title="Furgones"
        value={loading ? <FaSpinner className="spinner" /> : `${cantFurgones}`}
        route="/furgones"
      />
      <Card
        title="Utilitarios"
        value={
          loading ? <FaSpinner className="spinner" /> : `${cantUtilitarios}`
        }
        route="/utilitarios"
      />
    </>
  );
};

export default Flota;

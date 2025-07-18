import "./css/Dashboard.css";
import BigCard from "../components/BigCard";
import { FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";
import { listarColeccion } from "../functions/db-functions";
import { obtenerCuitPorNombre } from "../functions/data-functions";
import ImgTC from "../assets/images/logo-tc-color.png";
import ImgEX from "../assets/images/logo-ex-color.png";
import ImgTA from "../assets/images/logo-ta-color.png";

const Dashboard = () => {
  const [cantPersonasTC, setCantPersonasTC] = useState(0);
  const [cantPersonasEX, setCantPersonasEX] = useState(0);
  const [cantPersonasTA, setCantPersonasTA] = useState(0);
  const [cantTractoresTC, setCantTractoresTC] =useState(0);
  const [cantTractoresEX, setCantTractoresEX] =useState(0);
  const [cantTractoresTA, setCantTractoresTA] =useState(0);
  const [cantFurgonesTC, setCantFurgonesTC] = useState(0);
  const [cantFurgonesEX, setCantFurgonesEX] = useState(0);
  const [cantFurgonesTA, setCantFurgonesTA] = useState(0);
  
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try{
        const personas = await listarColeccion("personas");
        const tractores = await listarColeccion("tractores");
        const furgones = await listarColeccion("furgones");
        const empresaTC = Number(obtenerCuitPorNombre("TRANSPORTES CANTARINI"));
        const empresaEX = Number(obtenerCuitPorNombre("EXPRESO CANTARINI"));
        const empresaTA = Number(obtenerCuitPorNombre("TRANSAMERICA TRANSPORTES"));

        setCantPersonasTC(personas.filter(p => p.empresa === empresaTC).length);
        setCantPersonasEX(personas.filter(p => p.empresa === empresaEX).length);
        setCantPersonasTA(personas.filter(p => p.empresa === empresaTA).length);
        setCantTractoresTC(tractores.filter(t => t.empresa === empresaTC).length);
        setCantTractoresEX(tractores.filter(t => t.empresa === empresaEX).length);
        setCantTractoresTA(tractores.filter(t => t.empresa === empresaTA).length);
        setCantFurgonesTC(furgones.filter(f => f.empresa === empresaTC).length);
        setCantFurgonesEX(furgones.filter(f => f.empresa === empresaEX).length);
        setCantFurgonesTA(furgones.filter(f => f.empresa === empresaTA).length);
      } catch(error){
        console.error("Error al obtener datos con caché: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard container page">
      <div className="row">
        <div className="col-md-12">
          <BigCard 
            title="TRANSPORTES CANTARINI"
            value1={loading ? <FaSpinner className='spinner' /> : `${cantPersonasTC}`}
            value2={loading ? <FaSpinner className='spinner' /> : `${cantTractoresTC}`}
            value3={loading ? <FaSpinner className='spinner' /> : `${cantFurgonesTC}`}
            logo={ImgTC}
          />
        </div>

        <div className="col-md-12">
          <BigCard 
            title="EXPRESO CANTARINI"
            value1={loading ? <FaSpinner className='spinner' /> : `${cantPersonasEX}`}
            value2={loading ? <FaSpinner className='spinner' /> : `${cantTractoresEX}`}
            value3={loading ? <FaSpinner className='spinner' /> : `${cantFurgonesEX}`}
            logo={ImgEX}
          />
        </div>

        <div className="col-md-12">
          <BigCard 
            title="TRANSAMERICA TRANSPORTES"
            value1={loading ? <FaSpinner className='spinner' /> : `${cantPersonasTA}`}
            value2={loading ? <FaSpinner className='spinner' /> : `${cantTractoresTA}`}
            value3={loading ? <FaSpinner className='spinner' /> : `${cantFurgonesTA}`}
            logo={ImgTA}
          />
        </div>
      </div>
    </div>

  );
};

export default Dashboard;

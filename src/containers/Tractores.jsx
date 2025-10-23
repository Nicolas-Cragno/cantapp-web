import Reparaciones from "./sub-containers/Reparaciones";
import "./css/Sections.css";

const Tractores = () => {
  return (
    <section className="section-containers">
      <Reparaciones filtroSector="tractores"></Reparaciones>
    </section>
  );
};

export default Tractores;

import "./css/Sections.css";
import Reparaciones from "./sub-containers/Reparaciones";

const Tractores = () => {
  return (
    <section className="section-containers">
      <Reparaciones filtroSector="tractores"></Reparaciones>
    </section>
  );
};

export default Tractores;

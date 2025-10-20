import "./css/Sections.css";
import Reparaciones from "./sub-containers/Reparaciones";

const Furgones = () => {
  return (
    <section className="section-containers">
      <Reparaciones filtroSector="furgones"></Reparaciones>
    </section>
  );
};

export default Furgones;

import Reparaciones from "./sub-containers/Reparaciones";
import "./css/Sections.css";

const Furgones = () => {
  return (
    <section className="section-containers">
      <Reparaciones filtroSector="furgones"></Reparaciones>
    </section>
  );
};

export default Furgones;

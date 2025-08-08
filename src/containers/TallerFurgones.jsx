import "./css/Sections.css";
import Reparaciones from "./sub-containers/Reparaciones";

const TallerFurgones = () => {
  return (
    <section className="section-containers">
      <Reparaciones subArea="furgones"></Reparaciones>
    </section>
  );
};

export default TallerFurgones;

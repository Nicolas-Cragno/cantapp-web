import "./css/Sections.css";
import Personal from "./Personal";
import Flota from "./Flota";
import Contratados from "./Contratados";

const Resources = () => {
  return (
    <section className="section-container page">
      <div>
        <Personal />
        <Flota />
        <Contratados />
      </div>
    </section>
  );
};

export default Resources;

import "./css/Sections.css";
import Branches from "./Branches";
import Personal from "./Personal";
import Flota from "./Flota";
import Contratados from "./Contratados";

const Resources = () => {
  return (
    <section className="section-container page">
      <div>
        <Branches />
        <Flota />
      </div>
    </section>
  );
};

export default Resources;

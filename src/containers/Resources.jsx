import "./css/Sections.css";
import Personal from "./Personal";
import Flota from "./Flota";
import Stock from "./Stock";

const Resources = () => {
  return (
    <section className="section-container page">
      <div className="section-cards">
        <Personal />
        <Flota />
      </div>
    </section>
  );
};

export default Resources;

import "./css/Dashboard.css";
import CardInfo from "../components/CardInfo";


const Dashboard = () => {

  const colors = {
    rojo: "#c93242",
    azul: "#4161bd",
    amarillo: "#ebda50",
    naranja: "#f9bc86",
    violeta: "#b39ddb",
    verde: "#a5d6a7"
  };
  const sections = [
    {title:"Porteria", route: "/porteria", color: colors.rojo},
    {title:"Satelital", route:"/satelital", color:colors.azul},
    {title:"Taller", route:"/taller-camiones", color:colors.amarillo},
    {title:"Combustible", route:"/control-combustible", color:colors.naranja}
  ]
  const gestioners = [
    {title:"Personal", route:"/personal", color:colors.verde},
    {title:"Tractores", route:"/tractores", color:colors.violeta},
    {title:"Furgones", route:"/furgones", color:colors.naranja},
    {title:"Utilitarios", route:"utilitarios", color:colors.azul}
  ]

  return (
    <div className="dashboard page">
      <div className="container">
        <div className="row">
          {sections.map((s) => (
            <div className="col-md-4" key={s.title}>
              <CardInfo title={s.title} route={s.route} backColor={s.color}/>
            </div>
          ))}
        </div>
      </div><hr className="divisor"/>
      <h1 className="page-title">Gestionar recursos</h1>
      <div className="container">
        <div className="row">
          {gestioners.map((g) => (
            <div className="col-md-4" key={g.title}>
              <CardInfo title={g.title} route={g.route} backColor={g.color}/>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Dashboard;

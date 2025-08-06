import "./css/Dashboard.css";
import CardInfo from "../components/cards/CardInfo";
import LogoPorteria from "../assets/logos/logoporteria.png";
import LogoSatelital from "../assets/logos/logosatelital.png";
import LogoPersonal from "../assets/logos/logopersonal.png";
import LogoTractor from "../assets/logos/logotractor.png";
import LogoFurgon from "../assets/logos/logofurgon.png";
import LogoUtilitario from "../assets/logos/logoutilitario.png";

const Dashboard = () => {
  const colors = {
    rojo: "#c93242",
    azul: "#4161bd",
    amarillo: "#ebda50",
    naranja: "#f9bc86",
    violeta: "#b39ddb",
    verde: "#a5d6a7",
  };
  const sections = [
    {
      title: "Porteria",
      route: "/porteria",
      color: colors.rojo,
      img: LogoPorteria,
      state: true,
    },
    {
      title: "Satelital",
      route: "/actividad",
      color: colors.azul,
      img: LogoSatelital,
      state: true,
    },
    {
      title: "Taller Tractores",
      route: "/taller-camiones",
      color: colors.amarillo,
      state: false,
    },
    {
      title: "Combustible",
      route: "/control-combustible",
      color: colors.naranja,
      state: false,
    },
  ];
  const gestioners = [
    {
      title: "Personal",
      route: "/personal",
      color: colors.verde,
      img: LogoPersonal,
      state: true,
    },
    {
      title: "Tractores",
      route: "/tractores",
      color: colors.violeta,
      img: LogoTractor,
      state: true,
    },
    {
      title: "Furgones",
      route: "/furgones",
      color: colors.naranja,
      img: LogoFurgon,
      state: true,
    },
    {
      title: "Utilitarios",
      route: "/utilitarios",
      color: colors.azul,
      img: LogoUtilitario,
      state: true,
    },
    { title: "Stock", route: "/stock", color: colors.amarillo, state: false },
  ];

  return (
    <div className="dashboard page">
      <div className="container">
        <div className="row">
          {sections.map((s) => (
            <div className="col-md-4" key={s.title}>
              <CardInfo
                title={s.title}
                route={s.route}
                backColor={s.color}
                img={s.img}
                state={s.state}
              />
            </div>
          ))}
        </div>
      </div>
      <hr className="divisor" />
      <h1 className="page-title">Gestionar recursos</h1>
      <div className="container">
        <div className="row">
          {gestioners.map((g) => (
            <div className="col-md-4" key={g.title}>
              <CardInfo
                title={g.title}
                route={g.route}
                backColor={g.color}
                img={g.img}
                state={g.state}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

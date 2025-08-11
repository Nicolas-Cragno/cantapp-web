import "./css/Dashboard.css";
import CardInfo from "../components/cards/CardInfo";
import LogoPorteria from "../assets/logos/logoporteria.png";
import LogoSatelital from "../assets/logos/logosatelital.png";
import LogoPersonal from "../assets/logos/logopersonal.png";
import LogoTractor from "../assets/logos/logotractor.png";
import LogoFurgon from "../assets/logos/logofurgon.png";
import LogoUtilitario from "../assets/logos/logoutilitario.png";
import LogoStock from "../assets/logos/logostock.png";
import { Access } from "../routes/access/Access";

const Dashboard = () => {
  let rolUsuario = null;
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  try {
    rolUsuario = usuario?.rol || null;
  } catch {
    rolUsuario = null;
  }
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
      title: "Satelital",
      route: "/satelital",
      color: colors.azul,
      img: LogoSatelital,
      state: true,
    },
    {
      title: "Porteria",
      route: "/porteria",
      color: colors.rojo,
      img: LogoPorteria,
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
      access: Access["/personal"].includes(rolUsuario),
    },
    {
      title: "Tractores",
      route: "/tractores",
      color: colors.violeta,
      img: LogoTractor,
      state: true,
      access: Access["/tractores"].includes(rolUsuario),
    },
    {
      title: "Furgones",
      route: "/furgones",
      color: colors.naranja,
      img: LogoFurgon,
      state: true,
      access: Access["/furgones"].includes(rolUsuario),
    },
    {
      title: "Utilitarios",
      route: "/utilitarios",
      color: colors.azul,
      img: LogoUtilitario,
      state: true,
      access: Access["/utilitarios"].includes(rolUsuario),
    },
    {
      title: "Stock",
      route: "/stock",
      color: colors.amarillo,
      img: LogoStock,
      state: true,
      access: Access["/stock"].includes(rolUsuario),
    },
  ];

  return (
    <div className="dashboard page">
      <div className="container">
        <div className="row">
          <div className="col-md-5 dashboard-box">
            <div className="row">
              <h1 className="page-subtitle">Registros por area {rolUsuario}</h1>
              <hr />
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
          <div className="col"></div>
          <div className="col-md-5 dashboard-box">
            <div className="row">
              <h1 className="page-subtitle">Gestión de recursos</h1>
              <hr />
              {gestioners.map((g) => (
                <div className="col-md-4" key={g.title}>
                  <CardInfo
                    title={g.title}
                    route={g.route}
                    backColor={g.color}
                    img={g.img}
                    state={g.state}
                    access={g.access}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

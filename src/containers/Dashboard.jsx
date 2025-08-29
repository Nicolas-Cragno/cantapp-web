import "./css/Dashboard.css";
import CardInfo from "../components/cards/CardInfo";
import Card from "../components/cards/Card";
import LogoTallerF from "../assets/logos/logotallerfurgones.png";
import LogoPorteria from "../assets/logos/logoporteria-w.png";
import LogoSatelital from "../assets/logos/logosatelital-w.png";
import LogoPersonal from "../assets/logos/logopersonal-w.png";
import LogoTractor from "../assets/logos/logotractor-w.png";
import LogoFurgon from "../assets/logos/logofurgon-w.png";
import LogoUtilitario from "../assets/logos/logoutilitario-w.png";
import LogoStock from "../assets/logos/logostock-w.png";
import { Access } from "../routes/access/Access";

const Dashboard = () => {
  let rolUsuario = null;
  let gestionersView = false;
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  try {
    rolUsuario = usuario?.rol || null;
    if (rolUsuario === "dev" || rolUsuario === "admin") {
      gestionersView = true;
    }
  } catch {
    rolUsuario = null;
  }
  const colors = {
    rojo: "#82181A",
    azul: "#1447E6",
    amarillo: "#F0B13B",
    naranja: "#CA3519",
    violeta: "#59168B",
    verde: "#1F7A55",
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
      title: "Taller Furgones",
      route: "/taller-furgones",
      color: colors.amarillo,
      img: LogoTallerF,
      state: true,
    },
  ];
  const gestionersVehiculos = [
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
      color: colors.violeta,
      img: LogoFurgon,
      state: true,
      access: Access["/furgones"].includes(rolUsuario),
    },
    {
      title: "Utilitarios",
      route: "/utilitarios",
      color: colors.violeta,
      img: LogoUtilitario,
      state: true,
      access: Access["/utilitarios"].includes(rolUsuario),
    },
  ];
  const gestionersPersonal = [
    {
      title: "Mecánicos",
      route: "/mecanicos",
      color: colors.verde,
      img: LogoPersonal,
      state: true,
      access: Access["/personal"].includes(rolUsuario),
    },
    {
      title: "Choferes (larga)",
      route: "/choferes-larga",
      color: colors.verde,
      img: LogoPersonal,
      state: true,
      access: Access["/personal"].includes(rolUsuario),
    },
    {
      title: "Choferes (mov.)",
      route: "/choferes-movimiento",
      color: colors.verde,
      img: LogoPersonal,
      state: true,
      access: Access["/personal"].includes(rolUsuario),
    },
  ];

  return (
    <div className="dashboard page">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 dashboard-box">
            <div className="row">
              <h1 className="page-subtitle">Registros por area</h1>
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
          {gestionersView ? (
            <div className="col-xs-12 dashboard-box">
              <div className="row">
                <h1 className="page-subtitle">Gestión de recursos</h1>
                <hr />
                <div className="col-md-6">
                  {gestionersPersonal.map((g) => (
                    <div key={g.title}>
                      <CardInfo
                        title={g.title}
                        route={g.route}
                        backColor={g.color}
                        img={g.img}
                        state={g.state}
                        access={g.access}
                        small={true}
                      />
                    </div>
                  ))}
                </div>
                <div className="col-md-6">
                  {gestionersVehiculos.map((g) => (
                    <div key={g.title}>
                      <CardInfo
                        title={g.title}
                        route={g.route}
                        backColor={g.color}
                        img={g.img}
                        state={g.state}
                        access={g.access}
                        small={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

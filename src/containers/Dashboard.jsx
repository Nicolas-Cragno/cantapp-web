import "./css/Dashboard.css";
import CardInfo from "../components/cards/CardInfo";
import Clock from "../components/Clock";
import LogoPorteria from "../assets/logos/logoporteria-w.png";
import LogoSatelital from "../assets/logos/logosatelital-w.png";

const Dashboard = () => {
  let rolUsuario = null;
  let gestionersView = false;
  const catalogView = false; // para ver las cards de inicio o dejar el fondo vacio
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
  ];

  return (
    <div className="dashboard page">
      <div className="container">
        {catalogView ? (
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
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="no-responsive">
            <Clock />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome as LogoHome, FaSignOutAlt as LogoOut } from "react-icons/fa";
import { FaTruckFront as LogoTruck } from "react-icons/fa6";
import { RiListSettingsLine as LogoSettings } from "react-icons/ri";
import { PiShippingContainerFill as LogoContainer } from "react-icons/pi";
import { GrResources as LogoResources } from "react-icons/gr";
import { BsFillFuelPumpFill as LogoFuel } from "react-icons/bs";
import { FaSatelliteDish as LogoSatellite } from "react-icons/fa";

// ----------------------------------------------------------------------- imports internos
import Logo from "../assets/logos/logotruck.svg";
import "./css/SideBar.css";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [rotation, setRotation] = useState(0); // para el logo toggle

  // Obtener el rol desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rol = usuario?.rol || "user";

  // Función para validar el acceso por rol
  const tieneAcceso = (rolesPermitidos) => rolesPermitidos.includes(rol);

  // Lista de links con roles permitidos
  const linksAll = [
    {
      to: "/",
      icon: <LogoHome className="nav-icon" />,
      label: "Inicio",
      roles: ["dev", "superadmin", "admin", "user"],
    },
  ];
  const linksManagement = [
    {
      to: "/recursos",
      icon: <LogoResources className="nav-icon" />,
      label: "Recursos",
      roles: ["dev", "superadmin", "admin"],
    },
    {
      to: "/stock",
      icon: <LogoSettings className="nav-icon" />,
      label: "Stock",
      roles: ["dev", "superadmin", "admin"],
    },
  ];

  const linksEvents = [
    {
      to: "/porteria",
      icon: <LogoOut className="nav-icon" />,
      label: "Portería",
      roles: ["dev", "superadmin", "admin", "user"],
    },
    {
      to: "/tractores",
      icon: <LogoTruck className="nav-icon" />,
      label: "Tractores",
      roles: ["dev", "superadmin", "admin", "user"],
    },
    {
      to: "/furgones",
      icon: <LogoContainer className="nav-icon" />,
      label: "Furgones",
      roles: ["dev", "superadmin", "admin", "user"],
    },
    {
      to: "/satelital",
      icon: <LogoSatellite className="nav-icon" />,
      label: "Satelital",
      roles: ["dev", "superadmin", "admin", "user"],
    },
    {
      to: "/combustible",
      icon: <LogoFuel className="nav-icon" />,
      label: "Combustible",
      roles: ["dev"],
    },
  ];
  // Toggle de colapsado
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    setRotation(rotation + 360);
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {/* <FaBars /> */}
          <div className="logo-container">
            <img
              src={Logo}
              alt=""
              className={`toggle-logo ${!collapsed ? "collapsed-logo" : ""}`}
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            {!collapsed && (
              <span className="logo-text">
                CANT
                <span className="logo-text-bold">APP</span>
              </span>
            )}
          </div>
        </button>
      </div>
      <nav className="nav">
        {linksAll.map(
          ({ to, icon, label, roles }) =>
            tieneAcceso(roles) && (
              <Link key={to} to={to} className="nav-link">
                {icon}
                {!collapsed && <span>{label}</span>}
              </Link>
            )
        )}
      </nav>
      <nav className="nav">
        {linksManagement.map(
          ({ to, icon, label, roles }) =>
            tieneAcceso(roles) && (
              <Link key={to} to={to} className="nav-link">
                {icon}
                {!collapsed && <span>{label}</span>}
              </Link>
            )
        )}
      </nav>
      <nav className="nav">
        {linksEvents.map(
          ({ to, icon, label, roles }) =>
            tieneAcceso(roles) && (
              <Link key={to} to={to} className="nav-link">
                {icon}
                {!collapsed && <span>{label}</span>}
              </Link>
            )
        )}
      </nav>
    </aside>
  );
};

export default SideBar;

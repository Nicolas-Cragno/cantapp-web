import { useState } from "react";
import { FaHome, FaUser, FaTruck, FaBars, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RiListSettingsLine } from "react-icons/ri";
import { GiAutoRepair } from "react-icons/gi";
import { GrResources } from "react-icons/gr";
import "./css/SideBar.css";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaMapLocationDot } from "react-icons/fa6";
import Logo from "../assets/logos/logotruck.svg";

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
      icon: <FaHome className="nav-icon" />,
      label: "Inicio",
      roles: ["dev", "admin", "user"],
    },
  ];
  const linksManagement = [
    {
      to: "/recursos",
      icon: <GrResources className="nav-icon" />,
      label: "Recursos",
      roles: ["dev", "admin"],
    },
    {
      to: "/stock",
      icon: <RiListSettingsLine className="nav-icon" />,
      label: "Stock",
      roles: ["dev", "admin"],
    },
  ];

  const linksEvents = [
    {
      to: "/satelital",
      icon: <FaMapLocationDot className="nav-icon" />,
      label: "Satelital",
      roles: ["dev", "admin", "user"],
    },
    {
      to: "/porteria",
      icon: <FaSignOutAlt className="nav-icon" />,
      label: "Portería",
      roles: ["dev", "admin", "user"],
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

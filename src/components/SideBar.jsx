import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaTruck,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { GiAutoRepair } from "react-icons/gi";
import { IoCalendarSharp } from "react-icons/io5";
import "./css/SideBar.css";
import { BsFillFuelPumpFill } from "react-icons/bs";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(true);

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
  ]
  const linksManagement = [
    {
      to: "/personal",
      icon: <FaUser className="nav-icon" />,
      label: "Personal",
      roles: ["dev", "admin"],
    },
    {
      to: "/flota",
      icon: <FaTruck className="nav-icon" />,
      label: "Flota",
      roles: ["dev", "admin"],
    },
    
  ];

  const linksEvents = [
    {
      to: "/actividad",
      icon: <IoCalendarSharp className="nav-icon" />,
      label: "Actividad",
      roles: ["dev", "admin", "user"],
    },
    {
      to: "/porteria",
      icon: <FaSignOutAlt className="nav-icon" />,
      label: "Portería",
      roles: ["dev", "admin", "user"],
    },
    {
      to: "/taller-tractores",
      icon: <GiAutoRepair className="nav-icon dev" />,
      label: "Taller",
      roles: ["dev"],
    },
    {
      to: "/control-combustible",
      icon: <BsFillFuelPumpFill className="nav-icon dev" />,
      label: "Consumo",
      roles: ["dev"], 
    }
  ]
  // Toggle de colapsado
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>
      <nav className="nav">
        {linksAll.map(
          ({ to, icon, label, roles }) =>
            tieneAcceso(roles) && (
              <a key={to} href={to} className="nav-link">
                {icon}
                {!collapsed && <span>{label}</span>}
              </a>
            )
        )}
      </nav>
      <nav className="nav">
        {linksManagement.map(
          ({ to, icon, label, roles }) =>
            tieneAcceso(roles) && (
              <a key={to} href={to} className="nav-link">
                {icon}
                {!collapsed && <span>{label}</span>}
              </a>
            )
        )}
      </nav>
      <nav className="nav">
        {linksEvents.map(
          ({ to, icon, label, roles }) =>
            tieneAcceso(roles) && (
              <a key={to} href={to} className="nav-link">
                {icon}
                {!collapsed && <span>{label}</span>}
              </a>
            )
        )}
      </nav>
    </aside>
  );
};

export default SideBar;

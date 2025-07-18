import { useState } from "react";
import { FaHome, FaUser, FaTruck, FaBars } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { FaSignOutAlt } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import "./css/SideBar.css";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(true);

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
        <a href="/" className="nav-link">
          <FaHome className="nav-icon" />
          {!collapsed && <span>Inicio</span>}
        </a>
        <br/>
        <a href="/personal" className="nav-link">
          <FaUser className="nav-icon" />
          {!collapsed && <span>Personal</span>}
        </a>
        <a href="/flota" className="nav-link">
          <FaTruck className="nav-icon" />
          {!collapsed && <span>Flota</span>}
        </a>
        <br/>
        <a href="/porteria" className="nav-link">
          <FaSignOutAlt className="nav-icon"/>
          {!collapsed && <span>Porteria</span>}
        </a>
        <a href="/taller" className="nav-link">
          <GiAutoRepair className="nav-icon" />
          {!collapsed && <span>Taller</span>}
        </a>
        <a href="/combustible" className="nav-link">
          <BsFillFuelPumpFill className="nav-icon"/>
          {!collapsed && <span>Control</span>}
        </a>
      </nav>
    </aside>
  );
};

export default SideBar;

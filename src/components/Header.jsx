import "./css/Header.css";
import { useEffect, useState, useRef } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { buscarNombreUsuario } from "../functions/db-functions";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState("Usuario");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const user = auth.currentUser;

    const obtenerNombre = async () => {
      if (user) {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado) {
          const { nombres } = JSON.parse(usuarioGuardado);
          setUserName(nombres);
        } else {
          const nombre = await buscarNombreUsuario(user.uid);
          setUserName(nombre || user.email);
        }
      } else {
        setUserName("Invitado");
      }
    };

    obtenerNombre();
  }, []);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-user" ref={menuRef} onClick={() => setMenuAbierto(!menuAbierto)}>
        {userName} <FaCircleUser />
        {menuAbierto && (
          <div className="user-dropdown">
            <button onClick={handleLogout}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

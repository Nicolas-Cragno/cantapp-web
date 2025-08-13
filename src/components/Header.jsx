import "./css/Header.css";
import { useEffect, useState, useRef } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { buscarNombreUsuario } from "../functions/db-functions";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import FichaPerfil from "./fichas/FichaPerfil";

const Header = () => {
  const [userName, setUserName] = useState("Usuario");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const user = auth.currentUser;

    const obtenerNombre = async () => {
      if (user) {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado) {
          const datos = JSON.parse(usuarioGuardado);
          setUserName(datos.nombres);
          setUsuario(datos);
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

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    navigate("/login");
  };

  const handlePerfil = () => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
      setMostrarPerfil(true);
    }
  };

  return (
    <>
      <header className="header">
        <div
          className="header-user"
          ref={menuRef}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {userName} <FaCircleUser />
          {menuAbierto && (
            <div className="user-dropdown">
              <button onClick={handleLogout}>Cerrar sesión</button>
              <button onClick={handlePerfil}>Perfil</button>
            </div>
          )}
        </div>
      </header>

      {mostrarPerfil && (
        <FichaPerfil
          persona={usuario}
          onClose={() => setMostrarPerfil(false)}
          onGuardar={(perfilActualizado) => {
            setUsuario(perfilActualizado);
            setMostrarPerfil(false);
          }}
        />
      )}
    </>
  );
};

export default Header;

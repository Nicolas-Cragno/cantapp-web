// ----------------------------------------------------------------------- imports externos
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { FaCircleUser as LogoUser } from "react-icons/fa6";

// ----------------------------------------------------------------------- imports internos
import { useData } from "../context/DataContext";
import { buscarPersona } from "../functions/dataFunctions";
import FichaPerfil from "./fichas/FichaPerfil";
import "./css/Header.css";

const Header = () => {
  const { users } = useData();
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
        let datos = null;
        const usuarioGuardado = localStorage.getItem("usuario");

        if (usuarioGuardado) {
          datos = JSON.parse(usuarioGuardado);
        } else {
          const nombre = buscarPersona(users, user.uid);
          datos = {
            uid: user.uid,
            nombres: nombre || user.email,
            dni: user.dni || null,
          };
        }

        setUserName(datos.nombres);
        setUsuario(datos);
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
          {userName} <LogoUser />
          {menuAbierto && (
            <div className="user-dropdown">
              <button onClick={handleLogout}>Cerrar sesión</button>
              {/* <button onClick={handlePerfil}>Perfil</button> */}
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

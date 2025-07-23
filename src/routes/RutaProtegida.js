import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const roles = ["user", "admin", "dev"]; // orden jerárquico

const RutaProtegida = ({ children, rolRequerido = null }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsuscribe();
  }, []);

  if (loading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/login" />;

  if (rolRequerido) {
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return <Navigate to="/login" />;

    const usuario = JSON.parse(usuarioStr);
    const rolUsuario = usuario.rol;

    const nivelUsuario = roles.indexOf(rolUsuario);
    const nivelRequerido = roles.indexOf(rolRequerido);

    if (nivelUsuario === -1 || nivelUsuario < nivelRequerido) {
      return <Navigate to="/no-autorizado" />;
    }
  }

  return children;
};

export default RutaProtegida;

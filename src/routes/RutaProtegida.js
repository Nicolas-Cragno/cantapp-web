import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";  // importar Firestore
import { db } from "../firebase/firebaseConfig";

const roles = ["user", "admin", "dev"]; // orden jerárquico

const RutaProtegida = ({ children, rolRequerido = null }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const usuarioStr = localStorage.getItem("usuario");
        if (!usuarioStr) {
          // Recuperar datos desde Firestore y guardar en localStorage
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const usuario = docSnap.data();
              localStorage.setItem("usuario", JSON.stringify(usuario));
            } else {
              console.warn("Usuario autenticado pero no registrado en la BD.");
            }
          } catch (error) {
            console.error("Error recuperando usuario desde Firestore:", error);
          }
        }
      }

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

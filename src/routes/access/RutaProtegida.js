// ----------------------------------------------------------------------- imports externos
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { Access } from "./Access";

const jerarquia = ["user", "admin", "superadmin", "dev"];

const RutaProtegida = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user && !localStorage.getItem("usuario")) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            localStorage.setItem("usuario", JSON.stringify(docSnap.data()));
          }
        } catch (err) {
          console.error("Error obteniendo usuario:", err);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Cargando...</div>;

  if (!firebaseUser) return <Navigate to="/login" replace />;

  const rutaActual = location.pathname;
  const rolesPermitidos = Access[rutaActual];

  //if (!rolesPermitidos) return <Navigate to="/no-autorizado" replace />;
  if (!rolesPermitidos) {
        Swal.fire({
          title: "Recurso no disponible",
          text: "Es posible que se encuentre en reparación y/o producción",
          icon: "warning",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#4161bd",
        });
      }

  const usuarioStr = localStorage.getItem("usuario");
  if (!usuarioStr) return <Navigate to="/login" replace />;

  const { rol } = JSON.parse(usuarioStr);

  // Permite si rol está explícito o si jerárquicamente es mayor
  const tieneAcceso =
    rolesPermitidos.includes(rol) ||
    rolesPermitidos.some((r) => jerarquia.indexOf(rol) > jerarquia.indexOf(r));

    if (!tieneAcceso){
      Swal.fire({
        title: "Acceso restringido",
        theme: "dark",
        color: "white",
        text: "No tienes permiso en esta sección.",
        icon: "error",
        iconColor: "#cc0000",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#cc0000",
      });
      return <Navigate to="/" replace />;
    }


  return children;
};

export default RutaProtegida;

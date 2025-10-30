import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// cerrar sesión al cerrar ventana del navegador
export const useLogoutOnClose = () => {
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Solo para SUPERADMIN
    if (!usuario || usuario.tipo !== "superadmin") return;

    const handleBeforeUnload = async () => {
      try {
        await signOut(auth);
        localStorage.removeItem("usuario"); // limpiar también el localStorage
      } catch (error) {
        console.error("Error al cerrar sesión automáticamente:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

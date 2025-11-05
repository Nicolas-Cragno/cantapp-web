import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const useLogoutOnClose = () => {
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    //if (!usuario || usuario.tipo !== "superadmin") return;
    if (!usuario) return;


    const handleBeforeUnload = () => {
      localStorage.setItem("logoutOnClose", "1");
      localStorage.removeItem("usuario");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
};

export const useLogoutOnStart = () => {
  useEffect(() => {
    const shouldLogout = localStorage.getItem("logoutOnClose");

    if (shouldLogout) {
      localStorage.removeItem("logoutOnClose");

      signOut(auth)
        .then(() => {
          console.log("[LogOut] Sesión -ANTERIOR- cerrada automáticamente al iniciar");
          localStorage.removeItem("usuario");
        })
        .catch((err) => console.error("Error al cerrar sesión automática:", err));
    }
  }, []);
};

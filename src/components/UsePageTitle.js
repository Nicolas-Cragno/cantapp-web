import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function usePageTitle(baseTitle = "Cantapp") {
  const location = useLocation();

  const titles = {
    "/login" : "Login",
    "/" : "Inicio",
    "/recursos" : "Recursos",
    "/mecanicos" : "Mecánicos",
    "/choferes-larga" : "Choferes de larga distancia",
    "/choferes-movimiento" : "Choferes de movimiento",
    "/administrativos" : "Empleados Administrativos",
    "/seguridad" : "Vigilantes & seguridad",
    "/tractores" : "Tractores",
    "/furgones" : "Furgones",
    "/utilitarios" : "Vehículos utilitarios",
    "/fleteros" : "Choferes fleteros",
    "/stock" : "Control de stock",
    "/satelital" : "Control satelital",
    "/porteria" : "Portería, vigilancia & seguridad",
    "/taller-tractores" : "Taller de tractores",
    "/taller-furgones" : "Taller de furgones",
    "/control-combustible" : "Control de combustible"
  }

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const sectionTitle = titles[path] || path.replace("/", ""); // fallback
    document.title = `${baseTitle} | ${sectionTitle}`;
  }, [location, baseTitle]);
}

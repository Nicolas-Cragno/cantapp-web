import { lazy, Suspense } from "react";
import tipoEventos from "../../functions/data/eventos.json";

const fichas = {
  // desde evento.tipo
  stock: lazy(() => import("./FichaEventoStock")),
  llave: lazy(() => import("./FichaLlave")),
  viaje: lazy(() => import("./FichaViaje")),
  entrada: lazy(() => import("./FichaEventoPorteria")),
  salida: lazy(() => import("./FichaEventoPorteria")),
  deja: lazy(() => import("./FichaEventoPorteria")),
  entrega: lazy(() => import("./FichaEventoPorteria")),
  retira: lazy(() => import("./FichaEventoPorteria")),

  //desde evento.area
  porteria: lazy(() => import("./FichaEventoPorteria")),
  satelital: lazy(() => import("./FichaEventoSatelital")),
  tractores: lazy(() => import("./FichaEventoTaller")),
  furgones: lazy(() => import("./FichaEventoTaller")),
};

const FichaEventosGestor = ({ tipo, elemento, onClose, onGuardar }) => {
  const tipoLower = tipo.toLowerCase();

  const Ficha = fichas[tipoLower];
  if (!Ficha) {
    console.log("Error al buscar ficha para el tipo ", tipo);
    return null;
  }

  const props = { elemento, onClose, onGuardar };

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Ficha {...props} />
    </Suspense>
  );
};

export default FichaEventosGestor;

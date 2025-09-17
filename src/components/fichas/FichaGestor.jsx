import { lazy, Suspense } from "react";

const fichas = {
  porteria: lazy(() => import("./FichaEventoPorteria")),
  satelital: lazy(() => import("./FichaEventoSatelital")),
  taller: lazy(() => import("./FichaEventoTaller")),
  llave: lazy(() => import("./FichaLlavePorteria")),
  perfil: lazy(() => import("./FichaPerfil")),
  personal: lazy(() => import("./FichaPersonal")),
  stock: lazy(() => import("./FichaStock")),
  vehiculo: lazy(() => import("./FichaVehiculo")),
  viaje: lazy(() => import("./FichaViaje")),
};

const FichaGestor = ({
  tipo,
  filtroVehiculo = null,
  elemento,
  onClose,
  onGuardar,
}) => {
  const Ficha = fichas[tipo];
  if (!Ficha) {
    console.log("Error al buscar ficha para el tipo ", tipo);
    return null;
  }

  const props = { elemento, onClose, onGuardar };
  if (filtroVehiculo) props.tipoVehiculo = filtroVehiculo; // si se manda el parametro de tipo vehiculo, se agrega el prop

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Ficha {...props} />
    </Suspense>
  );
};

export default FichaGestor;

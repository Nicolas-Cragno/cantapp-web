import { lazy, Suspense } from "react";

const formularios = {
  // elementos (personas, vehiculos, etc)
  persona: lazy(() => import("./FormPersona")),
  vehiculo: lazy(() => import("./FormularioVehiculo")),
  // eventos, viajes, etc
  porteria: lazy(() => import("./FormularioEventoPorteria")),
  satelital: lazy(() => import("./FormularioEventoSatelital")),
  taller: lazy(() => import("./FormularioEventoTaller")),
  llave: lazy(() => import("./FormularioLlavePorteria")),
  stock: lazy(() => import("./FormularioStock")),
  movimientoStock: lazy(() => import("./FormularioMovimientoStock")),
  viaje: lazy(() => import("./FormularioViaje")),
};

const FormGestor = ({
  tipo,
  filtroVehiculo = null,
  elemento = null,
  onClose,
  onGuardar,
}) => {
  const Formulario = formularios[tipo];
  if (!Formulario) {
    console.log("Error al buscar formulario para el tipo ", tipo);
    return null;
  }

  const props = { elemento, onClose, onGuardar };
  if (filtroVehiculo) props.tipoVehiculo = filtroVehiculo; // si se manda el parametro de tipo vehiculo, se agrega el prop

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Formulario {...props} />
    </Suspense>
  );
};

export default FormGestor;

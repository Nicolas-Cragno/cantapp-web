import { lazy, Suspense } from "react";

const formularios = {
  // elementos (personas, vehiculos, etc)
  persona: lazy(() => import("./FormPersona")),
  vehiculo: lazy(() => import("./FormVehiculo")),
  // eventos, viajes, etc
  porteria: lazy(() => import("./FormEventoPorteria")),
  satelital: lazy(() => import("./FormularioEventoSatelital")),
  tractores: lazy(() => import("./FormularioEventoTaller")),
  llave: lazy(() => import("./FormLlave")),
  stock: lazy(() => import("./FormStock")),
  movimientoStock: lazy(() => import("./FormularioMovimientoStock")),
  viaje: lazy(() => import("./FormViaje")),
  movimiento: lazy(() => import("./FormMovimiento")),
};

const FormGestor = ({
  tipo,
  filtroSector = null,
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
  if (filtroSector) props.sector = filtroSector; // para el filtro de las llaves porteria/tractores

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Formulario {...props} />
    </Suspense>
  );
};

export default FormGestor;

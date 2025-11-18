// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";

// ----------------------------------------------------------------------- imports internos
import {
  formatearFecha,
  formatearHora,
  formatearFechaCorta,
  buscarPersona,
  buscarEmpresa,
  buscarDominio,
  buscarNombre,
} from "../../../functions/dataFunctions";

// ----------------------------------------------------------------------- data
import useEventos from "../useEventos";
import usePersonas from "../usePersonas";
import useEmpresas from "../useEmpresas";
import useTractores from "../useTractores";
import useFurgones from "../useFurgones";
import useVehiculos from "../useVehiculos";
import useUbicaciones from "../useUbicaciones";


export default function useMovimientos() {
  const AREA = "porteria";

  const eventos = useEventos();
  const personas = usePersonas();
  const empresas = useEmpresas();
  const tractores = useTractores();
  const furgones = useFurgones();
  const vehiculos = useVehiculos();
  const ubicaciones = useUbicaciones();
  const loading =
    eventos.loading ||
    personas.loading ||
    empresas.loading ||
    tractores.loading ||
    furgones.loading ||
    vehiculos.loading;

    
  // ------------------ Datos extra
    const movimientos = useMemo(() => {
      if (!eventos.data || eventos.data.length === 0) return [];
  
      const filtrados = eventos.data.filter((e) => e.area.toLowerCase() === AREA && e.tipo !== "STOCK");
  
      return filtrados.map((e) => {
        
        const nombrePersona = buscarPersona(personas.data, e.persona) || "";
        const nombreOperador = buscarPersona(personas.data, e.operador) || "";
        const nombreServicio = buscarEmpresa(empresas.data, e.servicio) || "";
        const dominioTractor = buscarDominio(e.tractor, tractores.data);
        const dominioFurgon = buscarDominio(e.furgon, furgones.data);
        const dominioVehiculo = buscarDominio(e.vehiculo, vehiculos.data);
        const nombreSucursal = buscarNombre(ubicaciones.data, e.sucursal);
        const fechaFormateada = formatearFecha(e.fecha);
        const horaFormateada = formatearHora(e.fecha);
        const fechaReducida = formatearFechaCorta(e.fecha);
        const movil = e.tractor ? e.tractor : e.furgon? e.furgon : e.vehiculo ? e.vehiculo : "";
        const dominioMovil = e.tractor ? dominioTractor : e.furgon ? dominioFurgon : e.vehiculo ? dominioVehiculo : "";
        const internoMovil = e.tractor ? e.tractor : e.furgon ? e.furgon : null;

        const searchText = `
          ${e.id} ${e.subtipo || ""} ${nombrePersona} ${e.tractor || ""}
          ${e.furgon || ""} ${fechaFormateada} ${horaFormateada} ${fechaReducida}
          ${e.tipo || ""} ${movil} ${e.usuario || ""} ${e.operador || ""} ${nombreOperador}
          ${nombreServicio} ${e.vehiculo || ""} ${internoMovil} ${dominioMovil} ${dominioVehiculo || ""} ${dominioTractor || ""} ${dominioFurgon || ""}
          ${e.persona || ""} ${e.servicio || ""}  ${e.proveedor || ""}
          ${e.detalle || ""} ${e.sucursal || ""} ${nombreSucursal || ""}
        `
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();
  
        return {
          ...e,
          fechaFormateada: formatearFecha(e.fecha),
          horaFormateada: formatearHora(e.fecha),
          fechaReducida: formatearFechaCorta(e.fecha),
          nombrePersona,
          nombreOperador,
          nombreServicio,
          dominioTractor,
          dominioFurgon,
          dominioVehiculo,
          movil,
          internoMovil,
          dominioMovil,
          nombreSucursal,
          searchText,
        };
      });
    }, [
      eventos.data,
      personas.data,
      empresas.data,
      tractores.data,
      furgones.data,
      ubicaciones.data,
    ]);

  return {
    loading,
    movimientos,
  };
}

import { useMemo } from "react";
import { useData } from "../DataContext";
import useEventos from "./useEventos";
import {
  formatearFecha,
  formatearHora,
  formatearFechaCorta,
  buscarPersona,
  buscarEmpresa,
  buscarDominio,
  buscarNombre,
} from "../../functions/dataFunctions";

export default function useMovimientos() {
  const {
    personas = [],
    empresas = [],
    tractores = [],
    furgones = [],
    vehiculos = [],
    ubicaciones = {},
    loading
  } = useData();

  const {data: eventosOrdenados } = useEventos();

  const AREA = "porteria";

  const movimientos = useMemo(() => {
    const filtrados = eventosOrdenados.filter(
      (e) => e.area?.toLowerCase() === AREA && e.tipo !== "STOCK"
    );

    return filtrados.map((e) => {
      const nombrePersona = buscarPersona(personas, e.persona);
      const nombreOperador = buscarPersona(personas, e.operador);
      const nombreServicio = buscarEmpresa(empresas, e.servicio);
      const dominioTractor = buscarDominio(e.tractor, tractores);
      const dominioFurgon = buscarDominio(e.furgon, furgones);
      const dominioVehiculo = buscarDominio(e.vehiculo, vehiculos);
      const nombreSucursal = buscarNombre(ubicaciones, e.sucursal);
      const internoMovil = e.tractor || e.furgon || "";
      const movil = e.tractor || e.furgon || e.vehiculo || "";
      const dominioMovil =
        dominioTractor || dominioFurgon || dominioVehiculo || "";


      const searchText= ` ${e.id || ""}
        ${e.tipo || ""}
        ${nombrePersona || ""}
        ${nombreOperador || ""}
        ${nombreServicio || ""}
        ${e.tractor || ""}
        ${e.furgon || ""}
        ${e.vehiculo || ""}
        ${dominioTractor || ""}
        ${dominioFurgon || ""}
        ${dominioVehiculo || ""}
        ${internoMovil || ""}
        ${movil || ""}
        ${dominioMovil || ""}
        ${nombreSucursal || ""}
        ${e.detalle || ""}`.toLowerCase()
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
        internoMovil,
        dominioFurgon,
        dominioVehiculo,
        movil,
        dominioMovil,
        nombreSucursal,
        searchText,
      };
    });
  }, [
    eventosOrdenados,
    personas,
    empresas,
    tractores,
    furgones,
    vehiculos,
    ubicaciones
  ]);

  return { movimientos, loading };
}

// ----------------------------------------------------------------------- imports externos
import { useMemo } from "react";

// ----------------------------------------------------------------------- imports internos
import {
  formatearFecha,
  formatearHora,
  buscarPersona,
  buscarEmpresa,
  buscarDominio,
  buscarNombre,
  formatearFechaCorta,
} from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- data
import { useData } from "../DataContext";
import useEventos from "./useEventos";

export default function useReparaciones(AREA = "tractores") {

  const {
    personas = [],
    tractores = [],
    furgones = [],
    stock = [],
    proveedores = [],
    empresas = [],
    ubicaciones = [],
    loading
  } = useData();
  const {data: eventosOrdenados} = useEventos();
  console.log("[Context] Inicio de filtrado de eventos (useReparaciones)");
  // ------------------ Datos extra
  const reparaciones = useMemo(() => {
    if (!eventosOrdenados || eventosOrdenados.length === 0) return [];

    const filtrados = eventosOrdenados.filter(
      (e) => e.area?.toLowerCase() === AREA && e.tipo !== "STOCK"
    );

    return filtrados.map((e) => {
      // ---------------- Mecánicos
      let mecanicoTxt = "";
      if (Array.isArray(e.mecanico)) {
        mecanicoTxt = e.mecanico
          .map((id) => buscarPersona(personas, id))
          .filter(Boolean)
          .join(", ");
      } else if (e.mecanico) {
        mecanicoTxt = buscarPersona(personas, e.mecanico) || e.mecanico;
      }

      // ---------------- Enriquecimiento general
      const nombrePersona = buscarPersona(personas, e.persona);
      const nombreOperador = buscarPersona(personas, e.operador);
      const nombreServicio = buscarEmpresa(empresas, e.servicio);
      const dominioTractor = buscarDominio(e.tractor, tractores);
      const dominioFurgon = buscarDominio(e.furgon, furgones);
      const nombreSucursal = buscarNombre(ubicaciones, e.sucursal);

      // ---------------- Fecha
      const fechaFormateada = formatearFecha(e.fecha);
      const horaFormateada = formatearHora(e.fecha);
      const fechaReducida = formatearFechaCorta(e.fecha);

      // ---------------- Texto de búsqueda
      const searchText = `
        ${e.id} ${e.subtipo || ""} ${nombrePersona || ""} ${e.tractor || ""}
        ${e.furgon || ""} ${fechaFormateada} ${horaFormateada} ${fechaReducida}
        ${e.tipo || ""} ${e.usuario || ""} ${e.operador || ""} ${nombreOperador || ""}
        ${nombreServicio || ""} ${e.vehiculo || ""} ${dominioTractor || ""} ${dominioFurgon || ""}
        ${e.persona || ""} ${e.servicio || ""} ${mecanicoTxt || ""} ${e.proveedor || ""}
        ${e.detalle || ""} ${e.sucursal || ""} ${nombreSucursal || ""} ${e.kilometraje}
      `
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      // ---------------- Objeto final enriquecido
      return {
        ...e,
        fechaFormateada,
        horaFormateada,
        fechaReducida,
        nombrePersona,
        nombreOperador,
        nombreServicio,
        dominioTractor,
        dominioFurgon,
        nombreSucursal,
        mecanicoTxt,
        searchText,
      };
    });
  }, [
    eventosOrdenados,
    personas,
    empresas,
    tractores,
    furgones,
    ubicaciones
  ]);
  console.log("[Context] Filtrado finalizado (useReparaciones) ✓✓");
  return { reparaciones, loading };
}

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
} from "../../../functions/dataFunctions";

// ----------------------------------------------------------------------- data
import usePersonas from "../usePersonas";
import useTractores from "../useTractores";
import useFurgones from "../useFurgones";
import useStock from "../useStock";
import useEventos from "../useEventos";
import useProveedores from "../useProveedores";
import useEmpresas from "../useEmpresas";
import useUbicaciones from "../useUbicaciones";


export default function useReparaciones(AREA = "tractores") {
  const personas = usePersonas();
  const tractores = useTractores();
  const furgones = useFurgones();
  const stock = useStock();
  const eventos = useEventos();
  const proveedores = useProveedores();
  const empresas = useEmpresas();
  const ubicaciones = useUbicaciones();

  const loading =
    personas.loading ||
    tractores.loading ||
    furgones.loading ||
    stock.loading ||
    eventos.loading ||
    proveedores.loading ||
    empresas.loading ||
    ubicaciones.loading;

  // ------------------ Datos extra
  const reparaciones = useMemo(() => {
    if (!eventos.data || eventos.data.length === 0) return [];

    const filtrados = eventos.data.filter((e) => e.area.toLowerCase() === AREA && e.tipo !== "STOCK");

    return filtrados.map((e) => {
      let mecanicoTxt = "";
      if (Array.isArray(e.mecanico)) {
        mecanicoTxt = e.mecanico
          .map((id) => buscarPersona(personas.data, id))
          .filter(Boolean)
          .join(", ");
      } else if (e.mecanico) {
        mecanicoTxt = buscarPersona(personas.data, e.mecanico) || e.mecanico;
      }

      const nombrePersona = buscarPersona(personas.data, e.persona) || "";
      const nombreOperador = buscarPersona(personas.data, e.operador) || "";
      const nombreServicio = buscarEmpresa(empresas.data, e.servicio) || "";
      const dominioTractor = buscarDominio(e.tractor, tractores.data);
      const dominioFurgon = buscarDominio(e.furgon, furgones.data);
      const nombreSucursal = buscarNombre(ubicaciones.data, e.sucursal);
      const fechaFormateada = formatearFecha(e.fecha);
      const horaFormateada = formatearHora(e.fecha);
      const fechaReducida = formatearFechaCorta(e.fecha);

      const searchText = `
        ${e.id} ${e.subtipo || ""} ${nombrePersona} ${e.tractor || ""}
        ${e.furgon || ""} ${fechaFormateada} ${horaFormateada} ${fechaReducida}
        ${e.tipo || ""} ${e.usuario || ""} ${e.operador || ""} ${nombreOperador}
        ${nombreServicio} ${e.vehiculo || ""} ${dominioTractor || ""} ${dominioFurgon || ""}
        ${e.persona || ""} ${e.servicio || ""} ${mecanicoTxt || ""} ${e.proveedor || ""}
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
        nombreSucursal,
        mecanicoTxt,
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
    reparaciones,
  };
}

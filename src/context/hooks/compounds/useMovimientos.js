// src/hooks/useMovimientos.js
import { useState, useMemo } from "react";
import useEventos from "../useEventos";
import usePersonas from "../usePersonas";
import useEmpresas from "../useEmpresas";
import useTractores from "../useTractores";
import useFurgones from "../useFurgones";
import useVehiculos from "../useVehiculos";

import {
  formatearFecha,
  formatearHora,
  buscarPersona,
  buscarEmpresa,
  buscarDominio,
} from "../../../functions/dataFunctions";

export default function useMovimientos() {
  const AREA = "porteria";

  // Hooks de colecciones
  const eventos = useEventos();
  const personas = usePersonas();
  const empresas = useEmpresas();
  const tractores = useTractores();
  const furgones = useFurgones();
  const vehiculos = useVehiculos();

  // Loading global
  const loading =
    eventos.loading ||
    personas.loading ||
    empresas.loading ||
    tractores.loading ||
    furgones.loading ||
    vehiculos.loading;

  // Filtro local
  const [filtro, setFiltro] = useState("");

  // Filtrar solo eventos del área
  const eventosPorteria = useMemo(() => {
    if (!eventos.data) return [];
    return eventos.data
      .filter((e) => e.area === AREA)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [eventos.data]);

  // Aplicar búsqueda global
  const movimientosFiltrados = useMemo(() => {
    if (!eventosPorteria.length) return [];

    return eventosPorteria.filter((e) => {
      const fechaTxt = formatearFecha(e.fecha);
      const horaTxt = formatearHora(e.fecha);
      const nombre = buscarPersona(personas.data, e.persona) || "";
      const operador = buscarPersona(personas.data, e.operador) || "";
      const servicio = buscarEmpresa(empresas.data, e.servicio) || "";
      const tractorDominio = buscarDominio(e.tractor, tractores.data);
      const furgonDominio = buscarDominio(e.furgon, furgones.data);

      const textoFiltro = `
        ${e.subtipo || ""}
        ${nombre}
        ${e.tractor || ""}
        ${e.furgon || ""}
        ${fechaTxt}
        ${horaTxt}
        ${e.tipo || ""}
        ${e.usuario || ""}
        ${operador}
        ${servicio}
        ${e.vehiculo || ""}
        ${tractorDominio}
        ${furgonDominio}
        ${e.id}
      `.toLowerCase();

      return textoFiltro.includes(filtro.toLowerCase());
    });
  }, [
    filtro,
    eventosPorteria,
    personas.data,
    empresas.data,
    tractores.data,
    furgones.data,
  ]);

  return {
    loading,
    filtro,
    setFiltro,
    movimientos: movimientosFiltrados,
    personas: personas.data,
    empresas: empresas.data,
    tractores: tractores.data,
    furgones: furgones.data,
    vehiculos: vehiculos.data,
  };
}

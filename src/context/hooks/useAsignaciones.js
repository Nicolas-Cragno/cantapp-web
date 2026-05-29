// ----------------------------------------------------------------------- imports externos
import { useMemo } from "react";

// ----------------------------------------------------------------------- imports internos
import {
    formatearFecha,
    formatearHora,
    formatearFechaCorta,
} from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- data
import { useData } from "../DataContext";

export default function useAsignaciones() {

    const {
        asignaciones = [],
        personas = [],
        stock = [],
        loading,
    } = useData();

    console.log(
        "[Context] Inicio de enriquecimiento de asignaciones"
    );

    // ------------------------------------------------ helpers

    const buscarPersona = (id) => {

        const persona = personas.find(
            (p) =>
                String(p.id) === String(id) ||
                String(p.dni) === String(id)
        );

        if (!persona) return "";

        return (
            persona.nombreCompleto ||
            `${persona.apellido || ""}, ${persona.nombres || ""}`.trim()
        );
    };

    const buscarArticulo = (id) => {

        const articulo = stock.find(
            (s) =>
                String(s.id) === String(id)
        );

        return articulo || null;
    };

    // ------------------------------------------------ data

    const data = useMemo(() => {

        if (!asignaciones || asignaciones.length === 0) {
            return [];
        }

        const enriquecidas = asignaciones.map((as) => {

            // ---------------- persona

            const nombrePersona =
                buscarPersona(as.persona);

            // ---------------- articulo

            const articulo =
                buscarArticulo(as.articulo);

            const nombreArticulo =
                articulo?.descripcion || "";

            const unidadArticulo =
                articulo?.unidad || "";

            const cantidadFull =
                `${as.cantidad || 0} ${unidadArticulo}`;

            // ---------------- fecha

            const fechaFormateada =
                formatearFecha(as.fecha);

            const horaFormateada =
                formatearHora(as.fecha);

            const fechaReducida =
                formatearFechaCorta(as.fecha);

            // ---------------- search text

            const searchText = `
        ${as.id || ""}
        ${nombrePersona || ""}
        ${nombreArticulo || ""}
        ${unidadArticulo || ""}
        ${as.usuario || ""}
        ${as.area || ""}
        ${as.detalle || ""}
        ${as.cantidad || ""}
        ${fechaFormateada || ""}
        ${horaFormateada || ""}
        ${fechaReducida || ""}
      `
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();

            // ---------------- objeto final

            return {
                ...as,

                nombrePersona,
                nombreArticulo,
                unidadArticulo,
                cantidadFull,

                fechaFormateada,
                horaFormateada,
                fechaReducida,

                searchText,
            };
        });

        return enriquecidas;

    }, [
        asignaciones,
        personas,
        stock,
    ]);

    console.log(
        "[Context] Enriquecimiento de asignaciones finalizado ✓✓"
    );

    return {
        asignaciones: data,
        loading,
    };
}
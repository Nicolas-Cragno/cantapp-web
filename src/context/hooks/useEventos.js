import { useMemo } from "react";
import { useData } from "../DataContext";

export default function useEventos() {
  const { eventos = [], loading } = useData();

  const eventosOrdenados = useMemo(() => {
    return [...eventos].sort((a, b) => {
      // Orden descendente: el ID más alto (último evento) arriba
      return b.id.localeCompare(a.id);
    });
  }, [eventos]);

  return { data: eventosOrdenados, loading };
}

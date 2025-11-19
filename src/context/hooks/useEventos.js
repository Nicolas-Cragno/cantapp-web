import { useMemo } from "react";
import { useData } from "../DataContext";

export default function useEventos() {
  const { eventos = [], loading } = useData();

  const eventosOrdenados = useMemo(() => {
    return [...eventos].sort((a, b) => {
      console.log("[Context] Eventos ordenados por ID ✓✓");
      return b.id.localeCompare(a.id);
    });
  }, [eventos]);

  return { data: eventosOrdenados, loading };
}

import { useMemo } from "react";
import { useData } from "../DataContext";

export default function useEventos() {
  const { eventos = [], loading } = useData();

  const eventosOrdenados = useMemo(() => {
    return [...eventos].sort((a, b) => b.fecha - a.fecha);
  }, [eventos]);

  return { data: eventosOrdenados, loading };
}

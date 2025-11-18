import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useEventos() {
  const { eventos, loading } = useData();

  const eventosOrdenados = eventos.sort((a,b) => b.fecha - a.fecha);
  return buildCollectionHook("eventos", eventosOrdenados, loading);
}

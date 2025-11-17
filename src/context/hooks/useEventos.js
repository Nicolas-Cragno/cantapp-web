import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useEventos() {
  const { eventos, loading } = useData();
  return buildCollectionHook("eventos", eventos, loading);
}

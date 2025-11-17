import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useEstaciones() {
  const { estaciones, loading } = useData();
  return buildCollectionHook("estaciones", estaciones, loading);
}

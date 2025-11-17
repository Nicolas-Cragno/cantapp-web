import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useSectores() {
  const { sectores, loading } = useData();
  return buildCollectionHook("sectores", sectores, loading);
}

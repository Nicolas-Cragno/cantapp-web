import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useSatelitales() {
  const { satelitales, loading } = useData();
  return buildCollectionHook("satelitales", satelitales, loading);
}

import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function usePersonas() {
  const { personas, loading } = useData();
  return buildCollectionHook("personas", personas, loading);
}

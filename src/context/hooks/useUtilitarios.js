import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useUtilitarios() {
  const { utilitarios, loading } = useData();
  return buildCollectionHook("utilitarios", utilitarios, loading);
}

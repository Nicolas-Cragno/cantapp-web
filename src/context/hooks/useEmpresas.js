import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useEmpresas() {
  const { empresas, loading } = useData();
  return buildCollectionHook("empresas", empresas, loading);
}

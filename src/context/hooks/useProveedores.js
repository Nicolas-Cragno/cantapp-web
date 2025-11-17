import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useProveedores() {
  const { proveedores, loading } = useData();
  return buildCollectionHook("proveedores", proveedores, loading);
}

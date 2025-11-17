import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useVehiculos() {
  const { vehiculos, loading } = useData();
  return buildCollectionHook("vehiculos", vehiculos, loading);
}

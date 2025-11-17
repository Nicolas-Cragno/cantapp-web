import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useUsoStock() {
  const { usoStock, loading } = useData();
  return buildCollectionHook("usoStock", usoStock, loading);
}

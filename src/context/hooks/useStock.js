import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useStock() {
  const { stock, loading } = useData();
  return buildCollectionHook("stock", stock, loading);
}

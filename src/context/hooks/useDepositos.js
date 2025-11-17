import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useDepositos() {
  const { depositos, loading } = useData();
  return buildCollectionHook("depositos", depositos, loading);
}

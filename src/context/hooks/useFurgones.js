import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useFurgones() {
  const { furgones, loading } = useData();

  return {
    furgones,
    loading,
    ...buildCollectionHook("furgones", furgones, loading),
  };
}

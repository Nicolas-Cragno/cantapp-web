import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useTractores() {
  const { tractores, loading } = useData();

  return {
    tractores,
    loading,
    ...buildCollectionHook("tractores", tractores, loading),
  };
}

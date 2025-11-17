import { useData } from "../DataContext";
import { buildCollectionHook } from "./helpers/collectionHelpers";

export default function useUsers() {
  const { users, loading } = useData();
  return buildCollectionHook("users", users, loading);
}

import { useData } from "../DataContext";

export default function useUbicaciones() {
  const { ubicaciones, loading } = useData();
  return { data: ubicaciones, loading };
}

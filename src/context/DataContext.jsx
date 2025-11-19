import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const DataContext = createContext();

const coleccionesFirestore = [
  "empresas",
  "sectores",
  "satelitales",
  "users",
  "personas",
  "furgones",
  "tractores",
  "vehiculos",
  "utilitarios",
  "stock",
  "proveedores",
  "eventos",
  "usoStock",
  "ubicaciones",
  "depositos",
  "estaciones"
];
let coleccionesCont = 0;

export function DataProvider({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem("usuario")) || { rol: "" };
  });
  useEffect(() => {
    const unsubscribers = [];

    coleccionesFirestore.forEach((nombreColeccion) => {
      const ref = collection(db, nombreColeccion);

      console.log("[Firestore] Iniciando carga de colecciones...");

      const unsubscribe = onSnapshot(ref, (snapshot) => {
        setData((prev) => {
          const nuevoData = {
            ...prev,
            [nombreColeccion]: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
          };

          // Si ya se cargaron todas las colecciones, ponemos loading false
          if (Object.keys(nuevoData).length === coleccionesFirestore.length) {
            setLoading(false);
          }
          console.log(" • " + nombreColeccion + " ✓");
          coleccionesCont++;
          return nuevoData;
        });
      });

      unsubscribers.push(unsubscribe);
    });

    return () => unsubscribers.forEach((fn) => fn());
  }, []);
  
  return <DataContext.Provider value={{ ...data, usuario, loading }}>{children}</DataContext.Provider>;
}



console.log(`[Firestore] Carga Finalizada (${coleccionesCont}/${coleccionesFirestore.length} coleccion${coleccionesFirestore.length !== 1 ? "es" : ""}) ✓✓`);
export const useData = () => useContext(DataContext);

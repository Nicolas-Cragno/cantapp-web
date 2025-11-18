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

export function DataProvider({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(() => {
    // Lo sacamos de localStorage solo una vez al iniciar
    return JSON.parse(localStorage.getItem("usuario")) || { rol: "" };
  });

  useEffect(() => {
    const unsubscribers = [];

    coleccionesFirestore.forEach((nombreColeccion) => {
      const ref = collection(db, nombreColeccion);

      const unsubscribe = onSnapshot(ref, (snapshot) => {
        setData((prev) => ({
          ...prev,
          [nombreColeccion]: snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        }));
      });

      unsubscribers.push(unsubscribe);
    });

    setLoading(false);

    return () => unsubscribers.forEach((fn) => fn());
  }, []);

  return (
    <DataContext.Provider value={{ loading, usuario, ...data }}>
      {children}
    </DataContext.Provider>
  );
}


export const useData = () => useContext(DataContext);

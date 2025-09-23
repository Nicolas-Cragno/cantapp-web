import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  // -------------------- Listado de tablas/colecciones de Firestore:
  // ------- empresas / clientes
  const [empresas, setEmpresas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [satelitales, setSatelitales] = useState([]);

  // ------- recursos
  const [users, setUsers] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [furgones, setFurgones] = useState([]);
  const [tractores, setTractores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [utilitarios, setUtilitarios] = useState([]);
  const [stock, setStock] = useState([]);

  // ------- eventos
  const [eventos, setEventos] = useState([]);
  const [usoStock, setUsoStock] = useState([]);

  // ------- informativos
  const [ubicaciones, setUbicaciones] = useState({}); // ahora será un objeto

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribers = [];
    let coleccionesCargadas = 0;

    const coleccionesFirestore = [
      { name: "empresas", setter: setEmpresas },
      { name: "sectores", setter: setSectores },
      { name: "satelitales", setter: setSatelitales },

      { name: "users", setter: setUsers },
      { name: "personas", setter: setPersonas },
      { name: "furgones", setter: setFurgones },
      { name: "tractores", setter: setTractores },
      { name: "vehiculos", setter: setVehiculos },
      { name: "utilitarios", setter: setUtilitarios },
      { name: "stock", setter: setStock },

      { name: "eventos", setter: setEventos },
      { name: "usoStock", setter: setUsoStock },

      { name: "ubicaciones", setter: setUbicaciones }, // se convertirá a objeto
    ];

    coleccionesFirestore.forEach(({ name, setter }) => {
      const q = query(collection(db, name));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let data;

        // Si es ubicaciones, convertir a objeto {id: doc.data()}
        if (name === "ubicaciones") {
          data = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
          }, {});
        } else {
          // para todas las demás colecciones dejamos array
          data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setter(data);

        coleccionesCargadas++;
        if (coleccionesCargadas === coleccionesFirestore.length)
          setLoading(false);
      });
      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        empresas,
        sectores,
        satelitales,
        users,
        personas,
        furgones,
        tractores,
        vehiculos,
        utilitarios,
        stock,
        eventos,
        usoStock,
        ubicaciones, // ahora es objeto
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

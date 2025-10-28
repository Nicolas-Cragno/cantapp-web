import { createContext, useContext, useState, useEffect, useRef } from "react";
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
  const [proveedores, setProveedores] = useState([]);

  // ------- eventos
  const [eventos, setEventos] = useState([]);
  const [usoStock, setUsoStock] = useState([]);

  // ------- informativos
  const [ubicaciones, setUbicaciones] = useState({}); // ahora será un objeto
  const [depositos, setDepositos] = useState([]);
  const [estaciones, setEstaciones] = useState([]);

  const [loading, setLoading] = useState(true);
  let cargaInicial = useRef(true); // bandera para carga inicial de la app.

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
      { name: "proveedores", setter: setProveedores },

      { name: "eventos", setter: setEventos },
      { name: "usoStock", setter: setUsoStock },

      { name: "ubicaciones", setter: setUbicaciones }, // objeto
      { name: "depositos", setter: setDepositos },
      { name: "estaciones", setter: setEstaciones },
    ];

    console.log(`Iniciando carga de datos desde Firestore Firebase...`);

    coleccionesFirestore.forEach(({ name, setter }) => {
      const q = query(collection(db, name));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let data;

        // ubicaciones consta de docs con info en formato json
        if (name === "ubicaciones") {
          data = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
          }, {});
        } else {
          // para el resto   array
          data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setter(data);
        if (cargaInicial.current) {
          console.log(
            `  ~ ${name} (${snapshot.size} ${
              snapshot.size === 1 ? "doc" : "docs"
            })  ✓️`
          );
        } else {
          console.log(`  ~ Actualizadación en ${name}  ✓️`);
        }

        coleccionesCargadas++;

        if (coleccionesCargadas === coleccionesFirestore.length) {
          console.log(
            `Carga finalizada (${coleccionesCargadas}/${
              coleccionesFirestore.length
            } ${
              coleccionesFirestore.length === 1 ? "coleccion" : "colecciones"
            }).`
          );
          cargaInicial.current = false;
          setLoading(false);
        }
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
        proveedores,
        eventos,
        usoStock,
        ubicaciones, // objeto
        depositos,
        estaciones,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

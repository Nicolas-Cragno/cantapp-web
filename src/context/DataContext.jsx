
import { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [data, setData] = useState({
    empresas: [],
    sectores: [],
    satelitales: [],
    users: [],
    personas: [],
    furgones: [],
    tractores: [],
    vehiculos: [],
    utilitarios: [],
    stock: [],
    proveedores: [],
    eventos: [],
    usoStock: [],
    ubicaciones: {}, // objeto
    depositos: [],
    estaciones: [],
  });
  const [loading, setLoading] = useState(true);
  const cargaInicial = useRef(true);
  const coleccionesTotales = useRef(0);

  // useEffect usuario
  useEffect(() => {
    const usuarioLS = localStorage.getItem("usuario");
    if (usuarioLS) {
      try {
        setUsuario(JSON.parse(usuarioLS));
      } catch (error) {
        console.warn("[DataContext] no se pudo parsear usuario en localStorage");
      }
    }
  }, []);
  // useEffect colecciones
  useEffect(() => {
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
      "ubicaciones", // objeto
      "depositos",
      "estaciones",
    ];

    coleccionesTotales.current = coleccionesFirestore.length;

    console.log(`[DataContext] Iniciando carga de colecciones firestore ...`);

    const unsubscribers = [];

    function shallowDiffers(oldVal, newVal) {
      try {
        if (!oldVal && newVal) return true;
        if (Array.isArray(oldVal) && Array.isArray(newVal)) {
          if (oldVal.length !== newVal.length) return true;
          const oldIds = oldVal.map((d) => d.id).join("|");
          const newIds = newVal.map((d) => d.id).join("|");
          return oldIds !== newIds;
        }
        if (typeof oldVal === "object" && typeof newVal === "object") {
          const oldKeys = Object.keys(oldVal || {}).join("|");
          const newKeys = Object.keys(newVal || {}).join("|");
          return oldKeys !== newKeys;
        }
        return JSON.stringify(oldVal) !== JSON.stringify(newVal);
      } catch (err) {
        return true;
      }
    }
    let inicialCargadas = 0;

    coleccionesFirestore.forEach((name) => {
      const q = query(collection(db, name));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let nuevaData;

          if (name === "ubicaciones") {
            // transformar a objeto
            nuevaData = snapshot.docs.reduce((acc, doc) => {
              acc[doc.id] = doc.data();
              return acc;
            }, {});
          } else {
            nuevaData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          }

          const actual = data[name];
          if (!shallowDiffers(actual, nuevaData)) {
            return;
          }

          setData((prev) => {
            // actualizar solo coleccion necesaria
            return { ...prev, [name]: nuevaData };
          });

          if (cargaInicial.current) {
            inicialCargadas++;
            console.log(`  ~ ${name} (${snapshot.size} ${snapshot.size === 1 ? "doc" : "docs"}) cargada.`);
            if (inicialCargadas === coleccionesTotales.current) {
              cargaInicial.current = false;
              setLoading(false);
              console.log(`[DataContext] Carga inicial finalizada.`);
            }
          } else {
            // actualizaciones posteriores
            console.log(`  ~ Actualización en ${name} (${snapshot.size}).`);
          }
        },
        (error) => {
          console.error(`[DataContext] Error en onSnapshot(${name}):`, error);
        }
      );

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((u) => u && u());
    };
  }, []); 

  const value = useMemo(() => {
    return {
      usuario,
      loading,
      empresas: data.empresas,
      sectores: data.sectores,
      satelitales: data.satelitales,
      users: data.users,
      personas: data.personas,
      furgones: data.furgones,
      tractores: data.tractores,
      vehiculos: data.vehiculos,
      utilitarios: data.utilitarios,
      stock: data.stock,
      proveedores: data.proveedores,
      eventos: data.eventos,
      usoStock: data.usoStock,
      ubicaciones: data.ubicaciones,
      depositos: data.depositos,
      estaciones: data.estaciones,
    };
  }, [
    usuario,
    loading,
    data.empresas,
    data.sectores,
    data.satelitales,
    data.users,
    data.personas,
    data.furgones,
    data.tractores,
    data.vehiculos,
    data.utilitarios,
    data.stock,
    data.proveedores,
    data.eventos,
    data.usoStock,
    data.ubicaciones,
    data.depositos,
    data.estaciones,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);

export default DataContext;

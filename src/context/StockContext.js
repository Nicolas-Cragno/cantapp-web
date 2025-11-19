import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const StockContext = createContext();

export function StockProvider({ children }) {
  const [stock, setStock] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);

  useEffect(() => {
    const ref = collection(db, "stock");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setStock(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingStock(false);
    });

    return unsubscribe;
  }, []);

  return (
    <StockContext.Provider value={{ stock, loadingStock }}>
      {children}
    </StockContext.Provider>
  );
}

export const useStock = () => useContext(StockContext);

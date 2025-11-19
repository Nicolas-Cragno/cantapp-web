import { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const EventosContext = createContext();

export function EventosProvider({ children }) {
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);

  useEffect(() => {
    const ref = collection(db, "eventos");

    const unsub = onSnapshot(ref, (snap) => {
      setEventos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingEventos(false);
    });

    return () => unsub();
  }, []);

  return (
    <EventosContext.Provider value={{ eventos, loadingEventos }}>
      {children}
    </EventosContext.Provider>
  );
}

export const useEventosData = () => useContext(EventosContext);

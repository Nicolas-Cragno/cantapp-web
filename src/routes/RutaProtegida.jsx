import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const RutaProtegida = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsuscribe();
    }, []);

    if(loading) return <div>Cargando...</div>;

    return user ? children : <Navigate to="/login" />;
};

export default RutaProtegida;
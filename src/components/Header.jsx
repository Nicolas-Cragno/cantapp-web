import "./css/Header.css";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { buscarNombreUsuario } from "../functions/db-functions";

const Header = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;

    if(user){
      const nameUser = buscarNombreUsuario(user.uid);
      setUserName(nameUser || user.email);
    } else {
      setUserName("Invitado");
    }
  }, []);

  return (
    <header className="header">
      <h2 className="header-title">Cantarini</h2>
      <div className="header-user">{userName}</div>
    </header>
  );
};

export default Header;

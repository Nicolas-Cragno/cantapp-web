// ----------------------------------------------------------------------- imports externos
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- imports internos
import { auth, db } from "../firebase/firebaseConfig";
import Logo from "../assets/images/logo-truck.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Buscar datos del usuario (como rol y nombre)
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const usuario = docSnap.data();
        localStorage.setItem("usuario", JSON.stringify(usuario)); // guarda nombre y rol
        setLoading(false);
        navigate("/");
      } else {
        Swal.fire({
          title: "Acceso denegado",
          text: "El usuario no está registrado en la base de datos.",
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#4161bd",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al inciiar sesión.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
    }
  };

  return (
    <div className="page login">
      {loading ? (
        <img src={Logo} alt="" className="login-logo-load"></img>
      ) : (
        <div className="login-card">
          <div className="login-header">
            <img src={Logo} alt="" className="login-logo"></img>
            <h2>Iniciar sesión</h2>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <button type="submit">Entrar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;

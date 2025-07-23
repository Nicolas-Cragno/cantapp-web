import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch(error){
            alert("Error al iniciar sesión: " + error.message);
        }
    };

    return(
        <div className="page login">
            <div className="login-card">
                <div className="login-header">
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
                    /><br/>
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
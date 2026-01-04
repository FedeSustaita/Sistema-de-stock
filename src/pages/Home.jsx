import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import api from "../api"; // tu archivo de axios con baseURL ya configurada

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useContext(AuthContext);

  const [usuario, setUsuario] = useState("");
  const [contra, setContra] = useState("");
    const logout = () => {
    setIsLoggedIn(false)
    localStorage.setItem("isLoggedIn", "false")
    }

  const enviar = async (e) => {
    e.preventDefault();

    try {
      // Llamada al backend para login
      const res = await api.post("/auth/login", {
        username: usuario,
        password: contra,
      });

      if (res.data.user) {
        // 🔐 Guardar sesión en contexto + localStorage
        login(res.data.user);
        navigate("/about"); // redirigir después del login
      }
    } catch (err) {
      console.error(err);
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>

            <h1>¡Bienvenido!</h1>
            <button onClick={logout} className="btn-logout">
                🔒 Cerrar sesión
            </button>
        </>
      ) : (
        <>
          <h1>Iniciar sesión</h1>
          <div className="content-form">
            <form onSubmit={enviar}>
              <label>Usuario:</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
              <br />
              <label>Contraseña:</label>
              <input
                type="password"
                value={contra}
                onChange={(e) => setContra(e.target.value)}
                required
              />
              <br />
              <button type="submit">Ingresar</button>
            </form>
          </div>
          <Link to="/log" className="crear">
            Crear cuenta
          </Link>
        </>
      )}
    </>
  );
};

export default Home;

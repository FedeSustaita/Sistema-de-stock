import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [contra, setContra] = useState("");

  const registrar = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://sistemabackend-i5uj.onrender.com/api/auth/register",
        { username: usuario, password: contra }
      );
      alert(res.data.message);
      navigate("/"); // volver al login
    } catch (err) {
      console.error(err);
      alert(err.response.data.error || "Error al crear la cuenta");
    }
  };

  return (
    <form onSubmit={registrar}>
      <label>Usuario:</label>
      <input value={usuario} onChange={(e) => setUsuario(e.target.value)} />
      <br />
      <label>Contraseña:</label>
      <input
        type="password"
        value={contra}
        onChange={(e) => setContra(e.target.value)}
      />
      <br />
      <button type="submit">Crear cuenta</button>
    </form>
  );
};

export default Register;

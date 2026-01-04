import { useState } from "react";
import api from "../api"; // tu archivo de axios con baseURL ya configurada
import { useNavigate } from "react-router-dom";

const Log = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [contra, setContra] = useState("");

  const enviar = async (e) => {
    e.preventDefault();

    try {
      // Llamada al backend para crear usuario
      const res = await api.post("/auth/register", {
        username: usuario,
        password: contra,
      });

      if (res.data.message) {
        console.log(res.data.message);
        alert("Cuenta creada correctamente");

        // Redirigir al login después de crear la cuenta
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert("Error al crear la cuenta");
      }
    }
  };

  return (
    <>
      <h1>Crear Cuenta</h1>
      <form onSubmit={enviar}>
        <label htmlFor="usuario">Usuario: </label>
        <input
          type="text"
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <br />
        <label htmlFor="contra">Contraseña: </label>
        <input
          type="password"
          id="contra"
          value={contra}
          onChange={(e) => setContra(e.target.value)}
          required
        />
        <br />
        <button type="submit">Crear cuenta</button>
      </form>
    </>
  );
};

export default Log;

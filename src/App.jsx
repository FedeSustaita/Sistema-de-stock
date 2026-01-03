import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Usuarios from "./pages/Usuario";
import Inventario from "./pages/Inventario";
import Log from "./pages/Log";
import Inicio from "./pages/Inicio";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/inicio">Inicio</Link> |
        <Link to="/inventario">Inventario</Link> |
        <Link to="/log">Log</Link> |
        <Link to="/usuarios">Usuarios</Link> |
        <Link to="/">sesion</Link> 
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/log" element={<Log />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import api from "../api" // axios con baseURL de tu backend

const Movimientos = () => {
  const { isLoggedIn } = useContext(AuthContext)

  const [productos, setProductos] = useState([])
  const [historial, setHistorial] = useState([])

  const [nombre, setNombre] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [precio, setPrecio] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [stockEst, setStockEst] = useState("")

  const [idVenta, setIdVenta] = useState("")
  const [cantidadVenta, setCantidadVenta] = useState("")

  const [idCompra, setIdCompra] = useState("")
  const [cantidadCompra, setCantidadCompra] = useState("")

  const [idMod, setIdMod] = useState("")
  const [nombreMod, setNombreMod] = useState("")
  const [cantidadMod, setCantidadMod] = useState("")
  const [precioMod, setPrecioMod] = useState("")
  const [descripcionMod, setDescripcionMod] = useState("")
  const [stockEstMod, setStockEstMod] = useState("")

  // Traer productos e historial desde backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/products")
        setProductos(res.data)
      } catch (err) {
        console.error("Error fetching products:", err)
      }
    }

    const fetchHistorial = async () => {
      try {
        const res = await api.get("/movimientos")
        setHistorial(res.data)
      } catch (err) {
        console.error("Error fetching historial:", err)
      }
    }

    fetchProductos()
    fetchHistorial()
  }, [])

  const registrarMovimiento = async (tipo, producto, cantidad) => {
    try {
      const res = await api.post("/movimientos", {
        tipo,
        producto,
        cantidad,
        fecha: new Date().toISOString(),
      })
      setHistorial(prev => [res.data, ...prev])
    } catch (err) {
      console.error("Error registrando movimiento:", err)
    }
  }

  const carga = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/products", {
        nombre,
        cantidad: Number(cantidad),
        precio: Number(precio),
        descripcion,
        stockEst: Number(stockEst),
      })
      setProductos(prev => [...prev, res.data])
      await registrarMovimiento("CARGA", nombre, Number(cantidad))

      setNombre("")
      setCantidad("")
      setPrecio("")
      setStockEst("")
      setDescripcion("")
    } catch (err) {
      console.error("Error agregando producto:", err)
    }
  }

  const venta = async (e) => {
    e.preventDefault()
    const producto = productos.find(p => p._id === idVenta)
    if (!producto) return

    try {
      const nuevaCantidad = producto.cantidad - Number(cantidadVenta)
      const res = await api.put(`/products/${idVenta}`, {
        cantidad: nuevaCantidad >= 0 ? nuevaCantidad : 0
      })
      setProductos(prev =>
        prev.map(p => (p._id === idVenta ? res.data : p))
      )
      await registrarMovimiento("VENTA", producto.nombre, Number(cantidadVenta))
      setIdVenta("")
      setCantidadVenta("")
    } catch (err) {
      console.error(err)
    }
  }

  const compra = async (e) => {
    e.preventDefault()
    const producto = productos.find(p => p._id === idCompra)
    if (!producto) return

    try {
      const nuevaCantidad = producto.cantidad + Number(cantidadCompra)
      const res = await api.put(`/products/${idCompra}`, {
        cantidad: nuevaCantidad
      })
      setProductos(prev =>
        prev.map(p => (p._id === idCompra ? res.data : p))
      )
      await registrarMovimiento("COMPRA", producto.nombre, Number(cantidadCompra))
      setIdCompra("")
      setCantidadCompra("")
    } catch (err) {
      console.error(err)
    }
  }

  const modificar = async (e) => {
    e.preventDefault()
    const producto = productos.find(p => p._id === idMod)
    if (!producto) return

    try {
      const res = await api.put(`/products/${idMod}`, {
        nombre: nombreMod,
        cantidad: Number(cantidadMod),
        precio: Number(precioMod),
        descripcion: descripcionMod,
        stockEst: Number(stockEstMod)
      })
      setProductos(prev =>
        prev.map(p => (p._id === idMod ? res.data : p))
      )
      await registrarMovimiento(
        "MODIFICACIÓN",
        producto.nombre,
        `Stock: ${producto.cantidad} → ${cantidadMod}`
      )

      setNombreMod("")
      setCantidadMod("")
      setPrecioMod("")
      setStockEstMod("")
      setIdMod("")
      setDescripcionMod("")
    } catch (err) {
      console.error(err)
    }
  }

  const eliminar = async (id) => {
    const producto = productos.find(p => p._id === id)
    if (!producto) return

    try {
      await api.delete(`/products/${id}`)
      setProductos(prev => prev.filter(p => p._id !== id))
      await registrarMovimiento("ELIMINACIÓN", producto.nombre, producto.cantidad)
    } catch (err) {
      console.error(err)
    }
  }

  if (!isLoggedIn) return <Navigate to="/" replace />

  return (
    <>
      <h1>Inventario</h1>
      <div className="contenedor-supremo">
        <div className="aside">
          {/* Carga */}
          <h2>Agregar productos</h2>
          <form onSubmit={carga}>
            <label>Nombre</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
            <br />
            <label>Cantidad</label>
            <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} required />
            <br />
            <label>Precio</label>
            <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} required />
            <br />
            <label>Descripcion</label>
            <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            <br />
            <label>Stock Estadar</label>
            <input type="number" value={stockEst} onChange={e => setStockEst(e.target.value)} required />
            <br />
            <button type="submit">Agregar</button>
          </form>

          {/* Venta */}
          <h3>Venta</h3>
          <form onSubmit={venta}>
            <select value={idVenta} onChange={e => setIdVenta(e.target.value)} required>
              <option value="">Seleccionar producto</option>
              {productos.map(p => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>
            <label>Cantidad</label>
            <input type="number" value={cantidadVenta} onChange={e => setCantidadVenta(e.target.value)} required />
            <button type="submit">Vender</button>
          </form>

          {/* Compra */}
          <h3>Compra</h3>
          <form onSubmit={compra}>
            <select value={idCompra} onChange={e => setIdCompra(e.target.value)} required>
              <option value="">Seleccionar producto</option>
              {productos.map(p => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>
            <label>Cantidad</label>
            <input type="number" value={cantidadCompra} onChange={e => setCantidadCompra(e.target.value)} required />
            <button type="submit">Comprar</button>
          </form>

          {/* Modificar */}
          <h3>Modificar</h3>
          <form onSubmit={modificar}>
            <label>ID del producto</label>
            <input type="text" value={idMod} onChange={e => setIdMod(e.target.value)} required />
            <br />
            <label>Nombre</label>
            <input type="text" value={nombreMod} onChange={e => setNombreMod(e.target.value)} required />
            <br />
            <label>Cantidad</label>
            <input type="number" value={cantidadMod} onChange={e => setCantidadMod(e.target.value)} required />
            <br />
            <label>Precio</label>
            <input type="number" value={precioMod} onChange={e => setPrecioMod(e.target.value)} required />
            <br />
            <label>Descripcion</label>
            <input type="text" value={descripcionMod} onChange={e => setDescripcionMod(e.target.value)} required />
            <br />
            <label>Stock Estadar</label>
            <input type="number" value={stockEstMod} onChange={e => setStockEstMod(e.target.value)} required />
            <br />
            <button type="submit">Modificar</button>
          </form>

          {/* Historial */}
          <div className="historial">
            <h3>Historial de movimientos</h3>
            <ul>
              {historial.map((h, i) => (
                <li key={i} className={`mov ${h.tipo.toLowerCase()}`}>
                  <strong>{h.tipo}</strong> | {h.producto} | Cantidad: {h.cantidad}
                  <small>{new Date(h.fecha).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Productos */}
        <div className="Right">
          <h3>Productos</h3>
          <ol>
            {productos.map(p => {
              const estado = (p.cantidad / p.stockEst) < 0.5 ? "bajo" : (p.cantidad / p.stockEst) < 1 ? "medio" : "ok"
              return (
                <div className={`card-prod ${estado}`} key={p._id}>
                  <div className="titulo"><h3>{p.nombre}</h3></div>
                  <hr />
                  <div className="main">
                    <h4>{p.cantidad} / {p.stockEst}</h4>
                    <div className="stock-bar">
                      <div className={`fill ${estado}`} style={{ width: `${(p.cantidad / p.stockEst) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="descr">{p.descripcion}</div>
                  <div className="footer">
                    <h4>Precio: ${p.precio}</h4>
                    <button onClick={() => eliminar(p._id)}>🗑</button>
                  </div>
                  <div className="color"></div>
                </div>
              )
            })}
          </ol>
        </div>
      </div>
    </>
  )
}

export default Movimientos

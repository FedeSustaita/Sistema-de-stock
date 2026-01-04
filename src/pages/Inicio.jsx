    import { useContext, useEffect, useState } from "react"
    import { Navigate, Link, BrowserRouter, Routes, Route } from "react-router-dom"
    import { AuthContext } from "../AuthContext"
    const Inicio = () => {
    const { isLoggedIn } = useContext(AuthContext)

    const [productos, setProd] = useState(() => {
        const data = localStorage.getItem("productos")
        return data ? JSON.parse(data) : []
    })
    const [totalpr, setTotalpr] = useState(null)

    const [historial, setHistorial] = useState(() => {
        const data = localStorage.getItem("historial")
        return data ? JSON.parse(data) : []
    })
    useEffect(() => {
        localStorage.setItem("historial", JSON.stringify(historial))
    }, [historial])

    useEffect(() => {
        localStorage.setItem("productos", JSON.stringify(productos))
    }, [productos])

    useEffect(() => {
        setTotalpr(productos.length)
    }, [productos])

    const totalVentas = historial.filter(m => m.tipo === "VENTA").reduce((total, m) => total + Number(m.cantidad), 0)
    const productosStockBajo = productos.filter(m=> (m.cantidad/m.stockEst)<0.5)
    const totalGeneral = productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);
    const ventas = historial.filter(m => m.tipo === "VENTA");
    const ventasPorProducto = ventas.reduce((acc, item) => {
        if (!acc[item.producto]) {
            acc[item.producto] = { producto: item.producto, totalVendidos: item.cantidad };
        } else {
            acc[item.producto].totalVendidos += item.cantidad;
        }
        return acc;
    }, {});

    const masVendidos = Object.values(ventasPorProducto).sort((a, b) => b.totalVendidos - a.totalVendidos);

console.log(masVendidos);


    console.log(productosStockBajo);
    
    console.log(totalGeneral);
    console.log(productos);
    console.log(historial);
    





    const [idVenta, setIdVenta] = useState("")
    const [cantidadVenta, setCantidadVenta] = useState("")
    const [puerta, setPuerta]=useState('cerrado')
    const [puerta2, setPuerta2]=useState('cerrado')
    const [idCompra, setIdCompra] = useState("")
    const [cantidadCompra, setCantidadCompra] = useState("")
    const abrir=()=>{
        setPuerta('abierto')
        setPuerta2('cerrado')
    }
    const abrir2=()=>{
        setPuerta2('abierto')
        setPuerta('cerrado')
    }
    const cerrar =()=>{
        setPuerta('cerrado')
    }
    const cerrar2 =()=>{
        setPuerta2('cerrado')
    }
    useEffect(() => {
        localStorage.setItem("productos", JSON.stringify(productos))
    }, [productos])
    const registrarMovimiento = (tipo, producto, cantidad) => {
        const movimiento = {
            tipo,
            producto,
            cantidad,
            fecha: new Date().toLocaleString()
        }

        setHistorial(prev => [movimiento, ...prev])
    }

    const venta = (e) => {
        e.preventDefault()

        const producto = productos.find(p => p.id === Number(idVenta))
        if (!producto) return

        const nuevaCantidad = producto.cantidad - Number(cantidadVenta)

        setProd(prev =>
            prev.map(p =>
                p.id === producto.id
                    ? { ...p, cantidad: nuevaCantidad >= 0 ? nuevaCantidad : 0 }
                    : p
            )
        )

        registrarMovimiento("VENTA", producto.nombre, Number(cantidadVenta))

        setIdVenta("")
        setCantidadVenta("")
    }
    const compra = (e) => {
        e.preventDefault()

        const producto = productos.find(p => p.id === Number(idCompra))
        if (!producto) return

        const nuevaCantidad = producto.cantidad + Number(cantidadCompra)

        setProd(prev =>
            prev.map(p =>
                p.id === producto.id
                    ? { ...p, cantidad: nuevaCantidad >= 0 ? nuevaCantidad : 0 }
                    : p
            )
        )

        registrarMovimiento("COMPRA", producto.nombre, Number(cantidadCompra))

        setIdCompra("")
        setCantidadCompra("")
    }



const haceUnaSemana = new Date()
haceUnaSemana.setDate(haceUnaSemana.getDate() - 7)
const ventasUltimaSemana = historial.filter(m => {
  if (m.tipo !== "VENTA") return false

  const fechaMovimiento = new Date(m.fecha)

  return fechaMovimiento >= haceUnaSemana
})
console.log(ventasUltimaSemana.length)

const ultimas5Ventas = historial
  .filter(m => m.tipo === "VENTA")
  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  .slice(0, 5)

console.log(ultimas5Ventas)




    if (!isLoggedIn) {
        return <Navigate to="/" replace />
    }

    return (
        <>
            <h1>Home</h1>
            <div className="contenedor">
                <div className="cards">
                    <h3>{totalVentas}</h3>
                    <h4>Ventas</h4>
                    <Link to="/movimientos">↗ Movimientos</Link>
                </div>
                <div className="cards">
                    <h3>{ventasUltimaSemana.length}</h3>
                    <h4>Ventas de la semana</h4>
                    <Link to="/movimientos">↗ Movimientos</Link>
                </div>
                <div className="cards">
                    <h3>{totalpr}</h3>
                    <h4>Productos</h4>
                    <Link to="/productos">↗ Productos</Link>
                </div>
                <div className="ValoInventario">
                    <h3>Valores de inventario</h3>
                    <div className="venta">
                        <div className="venta-palabra">venta</div>
                        <div className="venta-numero">${totalGeneral}</div>
                    </div>
                </div>
            </div>
            <div className="contenedor-main">
                <div className="contenedor-chico">
                    <h3>Stock Bajo</h3>
                    <hr />
                    <ul>
                        {productosStockBajo.map(p=>(
                            <li key={p.id}>
                                <div className="nombre">
                                    {p.nombre}
                                </div>
                                <div className="cantidad">
                                    {p.cantidad}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="contenedor-chico">
                    <h3>Más Vendidos</h3>
                    <hr />
                    <ul>
                        {masVendidos.map((p, index) => (
                            <li key={index}>
                                <div className="nombre">
                                    {p.producto}
                                </div>
                                <div className="cantidad">
                                    {p.totalVendidos}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            <div className="conten">
                <div className="conten-interno">
                    <h3>Acciones Rapidas</h3>
                    <div className="conten-botones">
                        <button onClick={abrir} className="venta">🛒 Venta Rapida</button>
                        <button onClick={abrir2} className="compra">📦 Compra Rapida</button>
                    </div>
                </div>
                    <div className={`pantalla ${puerta}`}>
                        <h3>Venta</h3>
                        <div className="formulario">
                            <form onSubmit={venta}>
                                <div className="form-contenedor">
                                    <div className="opciones">
                                        <select value={idVenta} onChange={e => setIdVenta(e.target.value)} required>
                                        <option value="">Seleccionar producto</option>
                                        {productos.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="cantidades">
                                        <label>Cantidad</label>
                                        <input type="number" value={cantidadVenta} onChange={e => setCantidadVenta(e.target.value)} required />
                                    </div>
                                </div>

                                <button type="submit">Vender</button>
                            </form>
                        </div>
                        <button onClick={cerrar}>Cerrar</button>
                    </div>
                    <div className={`pantalla2 ${puerta2}`}>
                        <h3>Compra</h3>
                        <div className="formulario">
                            <form onSubmit={compra}>
                                <div className="form-contenedor">
                                    <div className="opciones">
                                        <select value={idVenta} onChange={e => setIdVenta(e.target.value)} required>
                                        <option value="">Seleccionar producto</option>
                                        {productos.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="cantidades">
                                        <label>Cantidad</label>
                                        <input type="number" value={cantidadCompra} onChange={e => setCantidadCompra(e.target.value)} required />

                                    </div>
                                </div>

                                <button type="submit">Comprar</button>
                            </form>
                        </div>
                        <button onClick={cerrar2}>Cerrar</button>
                    </div>
            </div>
            <div className="contenedor-ventas">
                <div className="contenedor-ventas-interno">
                    <h3>Ultimas Ventas</h3>
                    <div className="contenedor-ventas-interno-tabla">
                        <ul>
                            {ultimas5Ventas.map((v, i) => (
                            <li key={i} className="venta-item">
                                <div className="venta-info">
                                <span className="producto">{v.producto}</span>
                                <span className="fecha">
                                    {new Date(v.fecha).toLocaleDateString("es-AR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                                </div>

                                <span className="cantidad">x{v.cantidad}</span>
                            </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </>
    )
    }

    export default Inicio

    import { useContext, useEffect, useState } from "react"
    import { Navigate } from "react-router-dom"
    import { AuthContext } from "../AuthContext"

    const Inventario = () => {
    const { isLoggedIn } = useContext(AuthContext)

    const [productos, setProd] = useState(() => {
        const data = localStorage.getItem("productos")
        return data ? JSON.parse(data) : []
    })
    const [historial, setHistorial] = useState(() => {
        const data = localStorage.getItem("historial")
        return data ? JSON.parse(data) : []
    })
    useEffect(() => {
        localStorage.setItem("historial", JSON.stringify(historial))
    }, [historial])

    const [nombre, setNombre] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [precio, setPrecio] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [stockEst, setStockEst] = useState("")
    const [idVenta, setIdVenta] = useState("")
    const [idCompra, setIdCompra] = useState("")
    const [cantidadVenta, setCantidadVenta] = useState("")
    const [cantidadCompra, setCantidadCompra] = useState("")
    const [nombreMod,setNombreMod] = useState("")
    const [cantidadMod, setCantidadMod] = useState("")
    const [precioMod, setPrecioMod] = useState("")
    const [descripcionMod, setDescripcionMod] = useState("")
    const [idMod, setIdMod] = useState("")
    const [stockEstMod, setStockEstMod] = useState("")
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

    const carga = (e) => {
        e.preventDefault()

        const prod = {
            id: Date.now(),
            nombre,
            cantidad: Number(cantidad),
            precio: Number(precio),
            descripcion: descripcion,
            stockEst: Number(stockEst)
        }

        setProd(prev => [...prev, prod])

        registrarMovimiento("CARGA", nombre, Number(cantidad))

        setNombre("")
        setCantidad("")
        setPrecio("")
        setStockEst("")
        setDescripcion("")
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

    const modificar = (e) => {
        e.preventDefault()

        const producto = productos.find(p => p.id === Number(idMod))
        if (!producto) return

        setProd(prev =>
            prev.map(p =>
                p.id === producto.id
                    ? {
                        ...p,
                        nombre: nombreMod,
                        cantidad: Number(cantidadMod),
                        precio: Number(precioMod),
                        descripcion: descripcion,
                        stockEst: Number(stockEstMod)
                    }
                    : p
            )
        )

        registrarMovimiento(
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
    }

    const eliminar = (id) => {
        const prod = productos.find(p => p.id === id)
        if (!prod) return

        setProd(prev => prev.filter(p => p.id !== id))

        registrarMovimiento("ELIMINACIÓN", prod.nombre, prod.cantidad)
    }



    if (!isLoggedIn) {
        return <Navigate to="/" replace />
    }

    return (
        <>
        <h1>Inventario</h1>
        <div className="contenedor-supremo">
            <div className="aside">

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
                
                <h3>Venta</h3>
                <form onSubmit={venta}>
                    <select value={idVenta} onChange={e => setIdVenta(e.target.value)} required>
                    <option value="">Seleccionar producto</option>
                    {productos.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nombre}
                        </option>
                    ))}
                    </select>

                    <label>Cantidad</label>
                    <input type="number" value={cantidadVenta} onChange={e => setCantidadVenta(e.target.value)} required />

                    <button type="submit">Vender</button>
                </form>
                <h3>Compra</h3>
                <form onSubmit={compra}>
                    <select value={idCompra} onChange={e => setIdCompra(e.target.value)} required>
                    <option value="">Seleccionar producto</option>
                    {productos.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nombre}
                        </option>
                    ))}
                    </select>

                    <label>Cantidad</label>
                    <input type="number" value={cantidadCompra} onChange={e => setCantidadCompra(e.target.value)} required />

                    <button type="submit">Comprar</button>
                </form>

                <h3>Modificar</h3>
                <form onSubmit={modificar}>
                    <label>ID del producto</label>
                    <input type="number" value={idMod} onChange={e => setIdMod(e.target.value)} required />
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
                <div className="historial">
                <h3>Historial de movimientos</h3>

                <ul>
                    {historial.map((h, i) => (
                    <li key={i} className={`mov ${h.tipo.toLowerCase()}`}>
                        <strong>{h.tipo}</strong> | {h.producto} | Cantidad: {h.cantidad}
                        <br />
                        <small>{h.fecha}</small>
                    </li>
                    ))}
                </ul>
                </div>

            </div>
            <div className="Right">
                <h3>Productos</h3>
                <ol>
                    {productos.map(p => {
                        const estado =
                            (p.cantidad/p.stockEst)<0.5 ? "bajo" :
                            (p.cantidad/p.stockEst)<1 ? "medio" :
                            "ok"
                            return(

                            
                    <div className={`card-prod ${estado}`} key={p.id}>
                        <div className="titulo"><h3>{p.nombre}</h3></div>
                        <hr />
                        <div className="main">
                        <h4>{p.cantidad} / {p.stockEst}</h4>
                        <div className="stock-bar">
                            <div 
                            className={`fill ${estado}`} 
                            style={{ width: `${(p.cantidad / p.stockEst) * 100}%` }}
                            ></div>
                        </div>
                        </div>
                        <div className="descr">
                            {p.descripcion}
                        </div>
                        <div className="footer">
                            <h4>
                                Precio: ${p.precio}
                            </h4>
                            <button onClick={()=>eliminar(p.id)}>🗑</button>
                        </div>
                        <div className={"color"}></div>
                    </div>
                            )
                    })}
                </ol>
            </div>
        </div>

        </>
    )
    }

    export default Inventario

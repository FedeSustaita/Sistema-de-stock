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
                    <Link to="/inventario">↗ Ver en el inventario</Link>
                </div>
                <div className="cards">
                    <h3>150</h3>
                    <h4>Ventas</h4>
                    <Link to="/inventario">↗ Ver en el inventario</Link>
                </div>
                <div className="cards">
                    <h3>{totalpr}</h3>
                    <h4>Productos</h4>
                    <Link to="/inventario">↗ Ver en el inventario</Link>
                </div>
                <div className="ValoInventario">
                    <h3>Valores de inventario</h3>
                    <div className="costo">
                        <div className="costo-palabra">Costo</div>
                        <div className="costo-numero">$15.000</div>
                    </div>
                    <div className="venta">
                        <div className="venta-palabra">venta</div>
                        <div className="venta-numero">$20.000</div>
                    </div>
                </div>
            </div>
        </>
    )
    }

    export default Inicio

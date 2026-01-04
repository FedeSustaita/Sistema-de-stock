import { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const Productos = () => {
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

    useEffect(() => {
        localStorage.setItem("productos", JSON.stringify(productos))
    }, [productos])


    const productosOrdenados = [...productos].sort(
    (a, b) => a.cantidad - b.cantidad
    )


    console.log(productos);
    console.log(historial);
    

const descargarPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Stock Completo", 14, 20)

    doc.setFontSize(11)
    doc.text(
        `Fecha: ${new Date().toLocaleDateString("es-AR")}`,
        14,
        28
    )

    const tableColumn = [
        "Producto",
        "Cantidad",
        "Stock Ideal",
        "Precio"
    ]

    const tableRows = productosOrdenados.map(p => [
        p.nombre,
        p.cantidad,
        p.stockEst,
        `$${p.precio}`
    ])

    autoTable(doc, {
        startY: 35,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [33, 150, 243] }
    })

    doc.save("stock-completo.pdf")
}








    if (!isLoggedIn) {
        return <Navigate to="/" replace />
    }

    return(
        <div className="contenedor-stock">
            <h1>
                Stock Completo
            </h1>
            <div className="contenedor-main-stock">
            <ul>
                {productosOrdenados.map(p => {
                const ratio = p.cantidad / p.stockEst

                return (
                    <li key={p.id} className={`item-stock ${ratio < 0.5 ? "bajo" : ratio < 1 ? "medio" : "ok"}`}>
                    <div className="stock-info">
                        <h3>{p.nombre}</h3>
                        <span className="stock-est">
                        Stock: {p.cantidad} / {p.stockEst}
                        </span>
                    </div>

                    <div className="stock-extra">
                        <span className="precio">${p.precio}</span>
                    </div>
                    </li>
                )
                })}
            </ul>
            </div>
                <button onClick={descargarPDF} className="btn-pdf">
                    📄 Descargar PDF
                </button>

        </div>
    )
}

export default Productos

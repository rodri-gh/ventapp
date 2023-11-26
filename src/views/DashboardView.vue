<template>
    <Menu />
    <div class="container mt-3">
        <div class="row row-cols-1 row-cols-md-2 g-4">
            <div class="col">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-cart-check-fill fs-1 text-primary"></i>
                        <h5 class="card-title">Ventas realizadas</h5>
                        <p class="card-text fw-bold fs-3">
                            {{ ventas.length }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-cash-stack fs-1 text-success"></i>
                        <h5 class="card-title">Total gasto en ingredientes</h5>
                        <p class="card-text fw-bold fs-3">
                            {{ totalGastoIngredientes }} Bs.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-receipt-cutoff fs-1 text-info"></i>
                        <h5 class="card-title">Total facturación</h5>
                        <p class="card-text fw-bold fs-3">
                            {{ totalFacturacion }} Bs.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-wallet2 fs-1 text-warning"></i>
                        <h5 class="card-title">Total ganancias</h5>
                        <p class="card-text fw-bold fs-3">
                            {{ totalGanancias }} Bs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3 d-flex justify-content-end">
            <button @click="descargarPDF" class="btn btn-primary mb-3">
                <i class="bi bi-file-earmark-pdf-fill"></i> PDF
            </button>
        </div>
        <div
            v-for="(ventasPorFecha, fecha) in ventasPorFecha"
            :key="fecha"
            class="card mb-3"
        >
            <div class="card-body">
                <h5 class="card-title text-center">
                    {{ fecha }}
                </h5>
                <div
                    class="d-flex justify-content-between mb-3 border-bottom pb-2"
                >
                    <strong>Productos:</strong>
                    <span>{{ ventasPorFecha.productos.join(', ') }}</span>
                </div>
                <div
                    class="d-flex justify-content-between mb-3 border-bottom pb-2"
                >
                    <strong>Ingredientes:</strong>
                    <span>{{ ventasPorFecha.totalGastoIngredientes }} Bs.</span>
                </div>
                <div
                    class="d-flex justify-content-between mb-3 border-bottom pb-2"
                >
                    <strong>Facturación:</strong>
                    <span>{{ ventasPorFecha.totalFacturacion }} Bs.</span>
                </div>
                <div
                    class="d-flex justify-content-between mb-3 border-bottom pb-2"
                >
                    <strong>Ganancia:</strong>
                    <span class="fw-bold fs-6"
                        >{{ ventasPorFecha.totalGanancias }} Bs.</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Menu from '../components/Menu.vue';
import { auth, db } from '../../firebase';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ventas = ref([]);

const cargarVentas = async () => {
    const q = query(
        collection(db, 'ventas'),
        where('userId', '==', auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    ventas.value = querySnapshot.docs.map((doc) => doc.data());
};

const totalGastoIngredientes = computed(() => {
    return ventas.value.reduce(
        (total, venta) =>
            total +
            venta.ingredientes.reduce(
                (total, ingrediente) => total + ingrediente.precio,
                0
            ),
        0
    );
});

const totalFacturacion = computed(() => {
    return ventas.value.reduce((total, venta) => total + venta.facturacion, 0);
});

const totalGanancias = computed(() => {
    return ventas.value.reduce((total, venta) => total + venta.ganancia, 0);
});
const ventasPorFecha = computed(() => {
    let ventasPorFecha = {};
    ventas.value.forEach((venta) => {
        if (!ventasPorFecha[venta.fecha]) {
            ventasPorFecha[venta.fecha] = {
                productos: [],
                totalGastoIngredientes: 0,
                totalFacturacion: 0,
                totalGanancias: 0,
            };
        }
        ventasPorFecha[venta.fecha].productos.push(venta.nombreProducto);
        ventasPorFecha[venta.fecha].totalGastoIngredientes +=
            venta.ingredientes.reduce(
                (total, ingrediente) => total + ingrediente.precio,
                0
            );
        ventasPorFecha[venta.fecha].totalFacturacion += venta.facturacion;
        ventasPorFecha[venta.fecha].totalGanancias += venta.ganancia;
    });
    // Convert the object to an array and sort it by date in descending order
    return Object.entries(ventasPorFecha)
        .sort(([fechaA], [fechaB]) => fechaB.localeCompare(fechaA))
        .reduce((obj, [fecha, data]) => ({ ...obj, [fecha]: data }), {});
});
const descargarPDF = () => {
    const doc = new jsPDF();

    // Agregar el título al PDF
    const title = 'Resumen de Ventas';
    const pdfWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.text(title, pdfWidth / 2, 15, { align: 'center' });

    const columns = [
        'Fecha',
        'Productos',
        'Gasto en Ingredientes',
        'Facturación',
        'Ganancia',
    ];
    const data = Object.entries(ventasPorFecha.value)
        .sort(([fechaA], [fechaB]) => fechaA.localeCompare(fechaB)) // Ordenar por fecha en orden ascendente
        .map(([fecha, venta]) => [
            fecha,
            venta && Array.isArray(venta.productos)
                ? venta.productos.join(', ')
                : '',
            venta ? venta.totalGastoIngredientes : 0,
            venta ? venta.totalFacturacion : 0,
            venta ? venta.totalGanancias : 0,
        ]);

    // Calcular los totales
    const totalGastoIngredientes = data.reduce(
        (total, venta) => total + venta[2],
        0
    );
    const totalFacturacion = data.reduce((total, venta) => total + venta[3], 0);
    const totalGanancias = data.reduce((total, venta) => total + venta[4], 0);

    // Agregar la fila de totales al final de los datos
    data.push([
        'Total',
        '',
        totalGastoIngredientes,
        totalFacturacion,
        totalGanancias,
    ]);

    autoTable(doc, {
        columns,
        body: data,
        styles: { lineWidth: 0.3, lineColor: [211, 211, 211] },
        startY: 20,
        didDrawCell: (data) => {
            // If this row is the last row
            if (data.row.index === data.table.body.length - 1) {
                doc.setFillColor(200, 200, 200); // Set the fill color to a light gray
                doc.rect(
                    data.cell.x,
                    data.cell.y,
                    data.cell.width,
                    data.cell.height,
                    'F'
                ); // Draw a rectangle with the fill color
                doc.setTextColor(0); // Set the text color to black
                doc.setFontSize(10); // Set the font size
                doc.text(
                    data.cell.text,
                    data.cell.x + 2,
                    data.cell.y + data.cell.height / 2,
                    { align: 'left', baseline: 'middle' }
                ); // Draw the cell text
            }
        }, // Comienza la tabla 30 unidades por debajo del inicio del documento
    });

    // Obtener la fecha actual
    const fechaDescarga = new Date();
    const fechaDescargaString = `${fechaDescarga.getFullYear()}-${
        fechaDescarga.getMonth() + 1
    }-${fechaDescarga.getDate()}`;

    // Guardar el PDF con un nombre que incluye la fecha de descarga
    doc.save(`Resumen_de_ventas_${fechaDescargaString}.pdf`);
};

cargarVentas();
</script>

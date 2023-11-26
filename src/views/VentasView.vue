<template>
    <Menu />
    <div class="container mt-3">
        <div class="mt-3 d-flex justify-content-between">
            <button @click="goToRegistroVenta" class="btn btn-primary mb-3">
                Registrar venta
            </button>
            <button @click="descargarPDF" class="btn btn-outline-danger mb-3">
                <i class="bi bi-file-earmark-pdf-fill"></i> PDF
            </button>
        </div>
        <div v-if="ventas.length">
            <div v-for="venta in ventas" :key="venta.id" class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title text-center">
                        {{ venta.nombreProducto }}
                    </h5>
                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Fecha:</strong>
                        <span>{{ venta.fecha }}</span>
                    </div>

                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Ingredientes:</strong>
                        <span
                            >{{
                                venta.ingredientes.reduce(
                                    (total, ingrediente) =>
                                        total + ingrediente.precio,
                                    0
                                )
                            }}
                            Bs.</span
                        >
                    </div>
                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Facturación:</strong>
                        <span>{{ venta.facturacion }} Bs.</span>
                    </div>
                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Ganancia:</strong>
                        <span class="fw-bold fs-6"
                            >{{ venta.ganancia }} Bs.</span
                        >
                    </div>

                    <div class="d-flex justify-content-between">
                        <button
                            id="button"
                            @click="editar(venta.id)"
                            class="btn btn-warning"
                        >
                            Editar
                        </button>
                        <button
                            id="button"
                            @click="ver(venta.id)"
                            class="btn btn-info"
                        >
                            Ver
                        </button>
                        <button
                            v-if="
                                auth.currentUser.email ===
                                    'rkorodri@gmail.com' &&
                                venta.userId === auth.currentUser.uid
                            "
                            id="button"
                            @click="eliminar(venta.id)"
                            class="btn btn-danger"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <p class="text-center" v-else>No hay ventas registradas</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../../firebase';
import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import Menu from '../components/Menu.vue';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ventas = ref([]);
const router = useRouter();

const cargarVentas = async () => {
    const q = query(
        collection(db, 'ventas'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('fecha', 'desc')
    );
    const querySnapshot = await getDocs(q);
    ventas.value = querySnapshot.docs.map((doc) => {
        let venta = {
            id: doc.id,
            ...doc.data(),
        };
        return venta;
    });
};

const goToRegistroVenta = () => {
    router.push('/ventas/registro');
};

const editar = (id) => {
    router.push(`/ventas/editar/${id}`);
};

const ver = (id) => {
    router.push(`/ventas/ver/${id}`);
};
const eliminar = async (id) => {
    await deleteDoc(doc(db, 'ventas', id));
    cargarVentas();
};
const descargarPDF = () => {
    const doc = new jsPDF();

    const title = 'Detalle de Ventas';
    const pdfWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.text(title, pdfWidth / 2, 15, { align: 'center' });
    const sortedVentas = ventas.value.sort((a, b) =>
        a.fecha.localeCompare(b.fecha)
    );
    let totalGasto = 0;
    let totalFact = 0;
    let totalGan = 0;
    const tableData = sortedVentas.map((venta) => {
        const gasto = venta.ingredientes.reduce(
            (total, ingrediente) => total + ingrediente.precio,
            0
        );
        totalGasto += gasto;
        totalFact += venta.facturacion;
        totalGan += venta.ganancia;
        return [
            venta.fecha,
            venta.nombreProducto,
            gasto,
            venta.facturacion | 0,
            venta.ganancia,
        ];
    });
    // Add the totals row
    tableData.push(['Total', '', totalGasto, totalFact, totalGan]);
    const headers = [
        'Fecha',
        'Producto',
        'Gasto en Ingredientes',
        'Facturación',
        'Ganancia',
    ];
    autoTable(doc, {
        head: [headers],
        body: tableData,
        styles: { lineWidth: 0.3, lineColor: [211, 211, 211] },
        startY: 20,
        didDrawCell: (data) => {
            // If this row is the last row
            if (data.row.index === tableData.length - 1) {
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
        },
    });
    const fechaDescarga = new Date();
    const fechaDescargaString = `${fechaDescarga.getFullYear()}-${
        fechaDescarga.getMonth() + 1
    }-${fechaDescarga.getDate()}`;
    doc.save(`Detalle_de_ventas_${fechaDescargaString}.pdf`);
};

cargarVentas();
</script>
<style scoped>
#button {
    width: 100px;
}
</style>

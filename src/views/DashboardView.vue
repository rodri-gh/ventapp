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
        <div
            v-for="(ventasPorFecha, fecha) in ventasPorFecha"
            :key="fecha"
            class="card mb-3 mt-3"
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

cargarVentas();
</script>

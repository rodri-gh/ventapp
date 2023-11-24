<template>
    <Menu />
    <div class="container mt-3">
        <div class="row">
            <div class="col-sm-6 col-lg-3 mb-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="bi bi-cart-check-fill fs-1 text-primary"></i>
                        <h5 class="card-title">Ventas realizadas</h5>
                        <p class="card-text">{{ ventas.length }}</p>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3 mb-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="bi bi-cash-stack fs-1 text-success"></i>
                        <h5 class="card-title">Total gasto en ingredientes</h5>
                        <p class="card-text">{{ totalGastoIngredientes }}</p>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3 mb-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="bi bi-receipt-cutoff fs-1 text-info"></i>
                        <h5 class="card-title">Total facturación</h5>
                        <p class="card-text">{{ totalFacturacion }}</p>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3 mb-4">
                <div class="card text-center">
                    <div class="card-body">
                        <i class="bi bi-wallet2 fs-1 text-warning"></i>
                        <h5 class="card-title">Total ganancias</h5>
                        <p class="card-text">{{ totalGanancias }}</p>
                    </div>
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

cargarVentas();
</script>

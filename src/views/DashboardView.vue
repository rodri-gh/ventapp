<template>
    <Menu />
    <div>
        <h2>Dashboard</h2>
        <p>Cantidad de ventas realizadas: {{ ventas.length }}</p>
        <p>Total gasto en ingredientes: {{ totalGastoIngredientes }}</p>
        <p>Total facturación: {{ totalFacturacion }}</p>
        <p>Total ganancias: {{ totalGanancias }}</p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import Menu from '../components/Menu.vue';
import { auth, db } from '../../firebase';

const ventas = ref([]);

const cargarVentas = async () => {
    const querySnapshot = await getDocs(collection(db, 'ventas'));
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

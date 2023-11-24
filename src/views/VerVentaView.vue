<template>
    <Menu />
    <div v-if="venta">
        <h1>{{ venta.nombreProducto }}</h1>
        <p>Fecha: {{ venta.fecha }}</p>
        <h2>Ingredientes</h2>
        <ul>
            <li v-for="(ingrediente, index) in venta.ingredientes" :key="index">
                {{ ingrediente.nombre }}: {{ ingrediente.precio }}
            </li>
        </ul>
        <p>Total de gasto de los ingredientes: {{ totalGastoIngredientes }}</p>
        <p>Total facturación: {{ venta.facturacion }}</p>
        <p>Ganancia: {{ venta.ganancia }}</p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Menu from '../components/Menu.vue';

const route = useRoute();
const venta = ref(null);

const cargarVenta = async () => {
    const docRef = doc(db, 'ventas', route.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        venta.value = docSnap.data();
    } else {
        console.log('No such document!');
    }
};

const totalGastoIngredientes = computed(() => {
    return venta.value
        ? venta.value.ingredientes.reduce(
              (total, ingrediente) => total + ingrediente.precio,
              0
          )
        : 0;
});

cargarVenta();
</script>

<template>
    <Menu />
    <div v-if="venta" class="container mt-3">
        <!-- Sección de Nombre de la Venta y Fecha -->
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title text-center">
                    {{ venta.nombreProducto }}
                </h5>
                <p><strong>Fecha:</strong> {{ venta.fecha }}</p>
            </div>
        </div>

        <!-- Sección de Ingredientes -->
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title text-center">Ingredientes</h5>
                <ul class="list-group">
                    <li
                        class="list-group-item"
                        v-for="(ingrediente, index) in venta.ingredientes"
                        :key="index"
                    >
                        {{ ingrediente.nombre }}: {{ ingrediente.precio }} Bs.
                    </li>
                </ul>
                <p class="mt-3 mx-2">
                    <strong>Total:</strong>
                    {{ totalGastoIngredientes }} Bs.
                </p>
            </div>
        </div>

        <!-- Sección de Facturación y Ganancias -->
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title text-center">Facturación y Ganancias</h5>
                <p>
                    <strong>Facturación:</strong>
                    {{ venta.facturacion | 0 }} Bs.
                </p>
                <p><strong>Ganancia:</strong> {{ venta.ganancia }} Bs.</p>
            </div>
        </div>
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

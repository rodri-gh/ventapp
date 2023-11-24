<template>
    <Menu />
    <div v-if="venta">
        <form @submit.prevent="submitForm">
            <div>
                <label>Nombre del producto:</label>
                <input v-model="venta.nombreProducto" type="text" />
            </div>
            <div>
                <label>Fecha:</label>
                <input v-model="venta.fecha" type="date" />
            </div>
            <div
                v-for="(ingrediente, index) in venta.ingredientes"
                :key="index"
            >
                <label>Nombre del ingrediente:</label>
                <input v-model="ingrediente.nombre" type="text" />
                <label>Precio:</label>
                <input v-model="ingrediente.precio" type="number" step="0.01" />
                <button @click.prevent="eliminarIngrediente(index, $event)">
                    Eliminar
                </button>
            </div>

            <div>
                <label>Costo total de los ingredientes:</label>
                <span>{{ totalGastoIngredientes }}</span>
            </div>
            <button @click="agregarIngrediente" type="button">
                Agregar ingrediente
            </button>
            <div>
                <label>Facturación:</label>
                <input v-model="venta.facturacion" type="number" step="0.01" />
            </div>
            <div>
                <label>Ganancia:</label>
                <span>{{ ganancia }}</span>
            </div>
            <button type="submit">Guardar</button>
            <button type="button" @click="cancelar">Cancelar</button>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth, db } from '../../firebase';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import DashboardView from './DashboardView.vue';
import Menu from '../components/Menu.vue';

const route = useRoute();
const router = useRouter();
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

const agregarIngrediente = () => {
    venta.value.ingredientes.push({ nombre: '', precio: null });
};

const ganancia = computed(() => {
    const totalCosto = venta.value.ingredientes.reduce(
        (total, ingrediente) => total + ingrediente.precio,
        0
    );
    return venta.value.facturacion - totalCosto;
});
const eliminarIngrediente = (index, event) => {
    event.preventDefault();
    if (
        confirm(
            `¿Estás seguro de que deseas eliminar el ingrediente ${venta.value.ingredientes[index].nombre} que tiene un costo de ${venta.value.ingredientes[index].precio}?`
        )
    ) {
        venta.value.ingredientes.splice(index, 1);
    }
};

const submitForm = async () => {
    try {
        const ventaActualizada = {
            userId: auth.currentUser.uid,
            nombreProducto: venta.value.nombreProducto,
            ingredientes: venta.value.ingredientes,
            facturacion: venta.value.facturacion,
            ganancia: ganancia.value,
            fecha: venta.value.fecha,
        };

        const docRef = doc(db, 'ventas', route.params.id);
        await updateDoc(docRef, ventaActualizada);
        router.push('/ventas');
    } catch (error) {
        console.error(error);
    }
};

const cancelar = () => {
    router.push('/ventas');
};

const totalGastoIngredientes = computed(() => {
    return venta.value
        ? venta.value.ingredientes.reduce(
              (total, ingrediente) => total + ingrediente.precio,
              0
          )
        : 0;
});

// llamar a cargarVenta cuando se crea el componente
cargarVenta();
</script>

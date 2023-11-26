<template>
    <Menu />
    <div v-if="venta" class="container mt-3">
        <form @submit.prevent="submitForm">
            <h3 class="text-center">Editar Venta</h3>
            <div class="mb-3">
                <label for="nombreProducto" class="form-label"
                    >Nombre del producto:</label
                >
                <input
                    v-model="venta.nombreProducto"
                    type="text"
                    id="nombreProducto"
                    class="form-control border-dark"
                />
            </div>
            <div class="mb-3">
                <label for="fecha" class="form-label">Fecha:</label>
                <input
                    v-model="venta.fecha"
                    type="date"
                    id="fecha"
                    class="form-control border-dark"
                />
            </div>
            <hr class="my-2 border-dark" />
            <h3 class="text-center">Ingredientes</h3>
            <div
                v-for="(ingrediente, index) in venta.ingredientes"
                :key="index"
                class="row mb-3"
            >
                <div class="col-7">
                    <label for="nombreIngrediente" class="form-label"
                        >Nombre:</label
                    >
                    <input
                        v-model="ingrediente.nombre"
                        type="text"
                        id="nombreIngrediente"
                        class="form-control border-dark"
                    />
                </div>
                <div class="col-3">
                    <label for="precio" class="form-label">Precio:</label>
                    <input
                        v-model="ingrediente.precio"
                        type="number"
                        step="0.01"
                        id="precio"
                        class="form-control border-dark"
                    />
                </div>
                <div class="col-2 d-flex align-items-end">
                    <button
                        @click.prevent="eliminarIngrediente(index, $event)"
                        class="btn btn-danger w-100"
                    >
                        -
                    </button>
                </div>
            </div>

            <div class="mb-3">
                <label for="costoTotal" class="form-label"
                    >Costo total de los ingredientes:</label
                >
                <span id="costoTotal" class="form-text fw-bold fs-6">{{
                    totalGastoIngredientes
                }}</span>
            </div>
            <button
                @click="agregarIngrediente"
                type="button"
                class="btn btn-primary mb-3"
            >
                Agregar ingrediente
            </button>
            <hr class="my-2 border-dark" />
            <h3 class="text-center">Facturación y Ganancia</h3>
            <div class="mb-3">
                <label for="facturacion" class="form-label">Facturación:</label>
                <input
                    v-model="venta.facturacion"
                    type="number"
                    step="0.01"
                    id="facturacion"
                    class="form-control border-dark"
                    
                />
            </div>
            <div class="mb-3">
                <label for="ganancia" class="form-label">Ganancia:</label>
                <span id="ganancia" class="form-text fw-bold fs-6">{{
                    ganancia
                }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <button
                    type="submit"
                    class="btn btn-success"
                    :disabled="deshabilitarBoton"
                >
                    {{ estadoBoton }}
                </button>
                <button
                    type="button"
                    @click="cancelar"
                    class="btn btn-secondary ms-2"
                >
                    Cancelar
                </button>
            </div>
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
const estadoBoton = ref('Guardar');
const deshabilitarBoton = ref(false);

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
    venta.value.ingredientes.splice(index, 1);
};

const submitForm = async () => {
    try {
        // Cambia el estado del botón a "Guardando..." y deshabilítalo
        estadoBoton.value = 'Guardando...';
        deshabilitarBoton.value = true;

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
        // Si hay un error, cambia el estado del botón a "Guardar" y habilita el botón
        estadoBoton.value = 'Guardar';
        deshabilitarBoton.value = false;
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

<template>
    <Menu />
    <form @submit.prevent="submitForm" class="container mt-3">
        <!-- Sección de Nombre de la Venta y Fecha -->
        <h3 class="text-center">Registrar Venta</h3>
        <div class="mb-3">
            <label for="nombreProducto" class="form-label"
                >Nombre del producto:</label
            >
            <input
                v-model="nombreProducto"
                type="text"
                id="nombreProducto"
                class="form-control border-dark"
            />
        </div>
        <div class="mb-3">
            <label for="fecha" class="form-label">Fecha:</label>
            <input
                v-model="fecha"
                type="date"
                id="fecha"
                class="form-control border-dark"
            />
        </div>
        <hr class="my-2 border-dark" />
        <h3 class="text-center">Ingredientes</h3>
        <div
            v-for="(ingrediente, index) in ingredientes"
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
            <span id="costoTotal" class="form-text">
                {{
                    ingredientes.reduce(
                        (total, ingrediente) => total + ingrediente.precio,
                        0
                    )
                }}
            </span>
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
                v-model="facturacion"
                type="number"
                step="0.01"
                id="facturacion"
                class="form-control border-dark"
            />
        </div>
        <div class="mb-3">
            <label for="ganancia" class="form-label">Ganancia:</label>
            <span id="ganancia" class="form-text">{{ ganancia }}</span>
        </div>
        <div class="d-flex justify-content-between mb-3">
            <button type="submit" class="btn btn-success">Guardar</button>
            <button
                type="button"
                @click="cancelar"
                class="btn btn-secondary ms-2"
            >
                Cancelar
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Menu from '../components/Menu.vue';

const nombreProducto = ref('');
const ingredientes = ref([{ nombre: '', precio: null }]);
const facturacion = ref(null);
const fecha = ref(null);

const router = useRouter();

const ganancia = computed(() => {
    const totalCosto = ingredientes.value.reduce(
        (total, ingrediente) => total + ingrediente.precio,
        0
    );
    return facturacion.value - totalCosto;
});

const agregarIngrediente = () => {
    ingredientes.value.push({ nombre: '', precio: null });
};
const eliminarIngrediente = (index, event) => {
    event.preventDefault();
    if (
        confirm(
            `¿Estás seguro de que deseas eliminar el ingrediente ${ingredientes.value[index].nombre} que tiene un costo de ${ingredientes.value[index].precio}?`
        )
    ) {
        ingredientes.value.splice(index, 1);
    }
};

const submitForm = async () => {
    try {
        const venta = {
            userId: auth.currentUser.uid,
            nombreProducto: nombreProducto.value,
            ingredientes: ingredientes.value,
            facturacion: facturacion.value,
            ganancia: ganancia.value,
            fecha: fecha.value,
        };

        await addDoc(collection(db, 'ventas'), venta);
        router.push('/ventas');
    } catch (error) {
        console.error(error);
    }
};

const cancelar = () => {
    router.push('/ventas');
};
</script>

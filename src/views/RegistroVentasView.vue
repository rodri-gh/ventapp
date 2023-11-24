<template>
    <Menu />
    <form @submit.prevent="submitForm">
        <div>
            <label>Nombre del producto:</label>
            <input v-model="nombreProducto" type="text" />
        </div>
        <div>
            <label>Fecha:</label>
            <input v-model="fecha" type="date" />
        </div>

        <div v-for="(ingrediente, index) in ingredientes" :key="index">
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
            <span>
                {{
                    ingredientes.reduce(
                        (total, ingrediente) => total + ingrediente.precio,
                        0
                    )
                }}
            </span>
        </div>
        <button @click="agregarIngrediente" type="button">
            Agregar ingrediente
        </button>
        <div>
            <label>Facturación:</label>
            <input v-model="facturacion" type="number" step="0.01" />
        </div>
        <div>
            <label>Ganancia:</label>
            <span>{{ ganancia }}</span>
        </div>
        <button type="submit">Guardar</button>
        <button type="button" @click="cancelar">Cancelar</button>
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

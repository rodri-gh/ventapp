<template>
    <Menu />
    <div>
        <button @click="goToRegistroVenta">Registrar venta</button>
        <table>
            <thead>
                <tr>
                    <th>Nombre del producto</th>
                    <th>Fecha</th>
                    <th>Total de gasto de los ingredientes</th>
                    <th>Total facturación</th>
                    <th>Ganancia</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="venta in ventas" :key="venta.id">
                    <td>{{ venta.nombreProducto }}</td>
                    <td>{{ venta.fecha }}</td>
                    <td>
                        {{
                            venta.ingredientes.reduce(
                                (total, ingrediente) =>
                                    total + ingrediente.precio,
                                0
                            )
                        }}
                    </td>
                    <td>{{ venta.facturacion }}</td>
                    <td>{{ venta.ganancia }}</td>
                    <td>
                        <button @click="editar(venta.id)">Editar</button>
                        <button @click="ver(venta.id)">Ver</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Menu from '../components/Menu.vue';

const ventas = ref([]);
const router = useRouter();

const cargarVentas = async () => {
    const q = query(collection(db, 'ventas'), orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    ventas.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
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
cargarVentas();
</script>

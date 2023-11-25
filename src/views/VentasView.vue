<template>
    <Menu />
    <div class="container mt-3">
        <button @click="goToRegistroVenta" class="btn btn-primary mb-3">
            Registrar venta
        </button>
        <div v-if="ventas.length">
            <div v-for="venta in ventas" :key="venta.id" class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title text-center">
                        {{ venta.nombreProducto }}
                    </h5>
                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Fecha:</strong>
                        <span>{{ venta.fechaFormateada }}</span>
                    </div>

                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Total de gasto de los ingredientes:</strong>
                        <span>{{
                            venta.ingredientes.reduce(
                                (total, ingrediente) =>
                                    total + ingrediente.precio,
                                0
                            )
                        }}</span>
                    </div>
                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Total facturación:</strong>
                        <span>{{ venta.facturacion }}</span>
                    </div>
                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Ganancia:</strong>
                        <span class="fw-bold fs-6">{{ venta.ganancia }}</span>
                    </div>

                    <div class="d-flex justify-content-between">
                        <button
                            id="button"
                            @click="editar(venta.id)"
                            class="btn btn-warning"
                        >
                            Editar
                        </button>
                        <button
                            id="button"
                            @click="ver(venta.id)"
                            class="btn btn-info"
                        >
                            Ver
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <p class="text-center" v-else>No hay ventas registradas</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import Menu from '../components/Menu.vue';
import { format } from 'date-fns';

const ventas = ref([]);
const router = useRouter();

const cargarVentas = async () => {
    const q = query(
        collection(db, 'ventas'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('fecha', 'desc')
    );
    const querySnapshot = await getDocs(q);
    ventas.value = querySnapshot.docs.map((doc) => {
        let venta = {
            id: doc.id,
            ...doc.data(),
        };
        venta.fechaFormateada = format(new Date(venta.fecha), 'dd-MM-yyyy');
        return venta;
    });
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
<style scoped>
#button {
    width: 100px;
}
</style>

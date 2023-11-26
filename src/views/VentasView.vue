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
                        <span>{{ venta.fecha }}</span>
                    </div>

                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Ingredientes:</strong>
                        <span
                            >{{
                                venta.ingredientes.reduce(
                                    (total, ingrediente) =>
                                        total + ingrediente.precio,
                                    0
                                )
                            }}
                            Bs.</span
                        >
                    </div>
                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Facturación:</strong>
                        <span>{{ venta.facturacion }} Bs.</span>
                    </div>
                    <div
                        class="d-flex justify-content-between mb-3 border-bottom pb-2"
                    >
                        <strong>Ganancia:</strong>
                        <span class="fw-bold fs-6"
                            >{{ venta.ganancia }} Bs.</span
                        >
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
                        <button
                            v-if="
                                auth.currentUser.email ===
                                    'rkorodri@gmail.com' &&
                                venta.userId === auth.currentUser.uid
                            "
                            id="button"
                            @click="eliminar(venta.id)"
                            class="btn btn-danger"
                        >
                            Eliminar
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
import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import Menu from '../components/Menu.vue';

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
const eliminar = async (id) => {
    await deleteDoc(doc(db, 'ventas', id));
    cargarVentas();
};
cargarVentas();
</script>
<style scoped>
#button {
    width: 100px;
}
</style>

import { createRouter, createWebHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import VentasView from '../views/VentasView.vue';
import RegistroVentasView from '../views/RegistroVentasView.vue';
import VerVentaView from '../views/VerVentaView.vue';
import EditarVentaView from '../views/EditarVentaView.vue';

let resolveAuthPromise;
const authPromise = new Promise((resolve) => {
    resolveAuthPromise = resolve;
});

onAuthStateChanged(auth, (user) => {
    const isAuthenticated = !!user;
    resolveAuthPromise(isAuthenticated);
});

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView,
        },
        {
            path: '/ventas',
            name: 'ventas',
            component: VentasView,
        },
        {
            path: '/ventas/registro',
            name: 'registro',
            component: RegistroVentasView,
        },
        {
            path: '/ventas/ver/:id',
            name: 'ver',
            component: VerVentaView,
        },
        {
            path: '/ventas/editar/:id',
            name: 'editar',
            component: EditarVentaView,
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/',
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = await authPromise;
    if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' });
    else next();
});

export default router;

<template>
    <form @submit.prevent="submitForm" class="container">
        <div class="mb-3">
            <label for="email" class="form-label">Correo</label>
            <input
                v-model="email"
                type="email"
                class="form-control"
                id="email"
                placeholder="alguien@correo.com"
            />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input
                v-model="password"
                type="password"
                class="form-control"
                id="password"
                placeholder="*********"
            />
        </div>
        <button type="submit" class="btn btn-primary">Iniciar sesión</button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const submitForm = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        window.location.href = '/dashboard';
        //router.push('/dashboard'); // No siempre funciona no se porque
    } catch (error) {
        console.error(error);
    }
};
</script>

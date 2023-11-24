<template>
    <form @submit.prevent="submitForm" class="container">
        <div class="mb-3">
            <label for="email" class="form-label">Correo</label>
            <input
                v-model="email"
                type="email"
                class="form-control"
                id="email"
                placeholder="Correo"
            />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input
                v-model="password"
                type="password"
                class="form-control"
                id="password"
                placeholder="Contraseña"
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
        router.push('/dashboard');
    } catch (error) {
        console.error(error);
    }
};
</script>

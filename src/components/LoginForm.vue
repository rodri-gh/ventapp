<template>
    <form @submit.prevent="submitForm">
        <input v-model="email" type="email" placeholder="Correo" />
        <input v-model="password" type="password" placeholder="Contraseña" />
        <button type="submit">Iniciar sesión</button>
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

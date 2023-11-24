<template>
    <button @click="logout">Cerrar sesión</button>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const router = useRouter();

const logout = async () => {
    try {
        await signOut(auth);
        router.push('/');
    } catch (error) {
        console.error(error);
    }
};
</script>

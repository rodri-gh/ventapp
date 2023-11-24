<template>
    <div class="vh-100 d-flex justify-content-center align-items-center">
        <div>
            <h2 class="text-center">Iniciar sesión</h2>
            <LoginForm @submit="handleSubmit" />
        </div>
    </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue';

const handleSubmit = (data) => {
    console.log(data);
};
</script>

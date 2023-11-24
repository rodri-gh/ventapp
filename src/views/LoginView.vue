<template>
    <div class="vh-100 d-flex justify-content-center align-items-center">
        <div class="card text-center" style="width: 20rem">
            <div class="card-header">
                <i class="bi bi-cash-stack display-1 text-success"></i>
                <h2 class="card-title">Bienvenido a Ventapp</h2>
            </div>
            <div class="card-body">
                <LoginForm @submit="handleSubmit" />
            </div>
            <div class="card-footer text-muted">
                <i class="bi bi-info-circle-fill"></i> Ingrese sus credenciales
                para continuar
            </div>
        </div>
    </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue';

const handleSubmit = (data) => {
    console.log(data);
};
</script>

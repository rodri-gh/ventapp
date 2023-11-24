<template>
    <div>
        <LoginForm @submit="handleSubmit" />
    </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue';

const handleSubmit = (data) => {
    console.log(data);
};
</script>

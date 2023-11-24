<template>
    <div>
        <nav>
            <router-link to="/dashboard">Dashboard</router-link>
            <router-link to="/ventas">Ventas</router-link>
            <LogoutButton />
        </nav>
        <router-view />
    </div>
</template>

<script setup>
import LogoutButton from './LogoutButton.vue';
</script>

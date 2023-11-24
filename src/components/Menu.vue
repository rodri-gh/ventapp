<template>
    <div class="d-flex flex-column">
        <nav class="navbar navbar-expand navbar-light bg-light">
            <div class="container-fluid">
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link
                                class="nav-link"
                                to="/dashboard"
                                :style="{
                                    color: isActive('/dashboard')
                                        ? '#4ade80'
                                        : '',
                                }"
                                >Inicio</router-link
                            >
                        </li>
                        <li class="nav-item">
                            <router-link
                                class="nav-link"
                                to="/ventas"
                                :style="{
                                    color: isActive('/ventas') ? '#4ade80' : '',
                                }"
                                >Ventas</router-link
                            >
                        </li>
                    </ul>
                    <LogoutButton class="btn btn-outline-danger" />
                </div>
            </div>
        </nav>
        <router-view />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import LogoutButton from './LogoutButton.vue';

const route = useRoute();

const isActive = (path) => {
    return route.path === path;
};
</script>

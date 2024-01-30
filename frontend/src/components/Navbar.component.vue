<script setup>
import { socket } from '../../socket';


// Same here, defining props that I will use in this component
defineProps(['username', 'picture']);

const username = localStorage.getItem('username');

const logout = () => {
    socket.emit('logout', username)
    localStorage.removeItem('username');
    setTimeout(() => {
        window.location.href = '/login';
    }, 1000);
}


// Here at line 18 I conditionnaly show the "Welcome username" message
</script>



<template>
    <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand mx-3 text-white fw-bold" href="#">MyChatApp</a>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        </div>
        <div v-if="$route.path !== '/login'" class="navbar-nav ml-auto mx-3">
            <a class="nav-item nav-link ml-auto text-white" href="#">Welcome <strong>{{ username }}</strong></a>
            <img class="rounded-circle mx-auto" :src="picture" alt="profile picture" width="50" height="50">
            <a class="nav-item nav-link ml-auto text-white" @click="logout" style="cursor: pointer;">Logout</a>

        </div>
    </nav>
</template>

<style scoped>
nav {
    background-color: var(--secondary-color);
}

.pointer {
    cursor: pointer;
}


@media (max-width: 768px) {
    nav {
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
    }

}
</style>    
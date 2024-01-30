<script setup>

// Built-in
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

// Socket.io
import { socket, state } from '../../socket';

// Components
import Navbar from "../components/Navbar.component.vue";
import OnlineUsers from '../components/OnlineUsers.component.vue';
import MessageInGrid from "../components/MessageInGrid.component.vue";

// Utils
import { getProfilePicture } from '../services/getProfilePicture';

const router = useRouter();

const picture = ref('');

// I fetch the username from local storage
// This is a much simpler way than using cookie and
// a real authentication system ...
const username = localStorage.getItem('username');


if (username === null) {
    router.push('/login');
} else {
    socket.emit('user connect', username);
}


const message = ref('');

const userTyping = () => {
    socket.emit('typing', username);
}

const submitMessage = (e) => {
    e.preventDefault();
    socket.emit('chat message', { username: username, msg: message.value });
    message.value = '';
    state.typingUsers = [];
}


onMounted(async () => {
    // When the comoonent is mounted (loaded), I fetch the profile picture
    await getProfilePicture(username, picture);

});


</script>



<template>
    <Navbar :username="username" :picture="picture" />
    <h1 class="text-center mt-4">My chat App</h1>
    <OnlineUsers :state="state" />
    <div class="container py-5 my-5 messages-container">
        <div v-for="element in state.messages" :key="element" class="chat-message">
            <MessageInGrid :element="element" />
        </div>
        <form @submit.prevent="submitMessage">
            <div v-for="user in state.typingUsers" class="text-center pt-3"><small>{{ user }} is typing ...</small></div>
            <input v-model="message" @input="userTyping" type="text" placeholder="Write a nice message ...">
        </form>

    </div>
</template>

<style scoped>
.messages-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;

    border: 1px solid #ccc;
    border-radius: 15px;
    min-height: 500px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--primary-color);
    border-radius: 15px;
    margin-top: 10px;
}
</style>
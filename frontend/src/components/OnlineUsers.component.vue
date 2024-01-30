<script setup>

// The state prop is imported from socket.js and defined
// in Home.page.vue line 8
const props = defineProps(['state']);

// The state looks like this:
// export const state = reactive({
//   connected: false,
//   onlineUsers: [],
//   messages: [],
//   typingUsers: [],
// });

setInterval(() => {
    // console.log(props.state.onlineUsers);
}, 1000);

</script>



<template>
    <h5 class="text-center">Online users</h5>
    <div v-for="user in props.state.onlineUsers" class="online-users container mx-auto my-3">
        <div v-if="user.length > 1">{{ user }}</div>
    </div>
</template>


<style scoped>
.online-users {
    border: 1px solid var(--primary-color);
    border-radius: 15px;
    padding: 8px;
    margin: 10px;
    width: fit-content;
    text-align: center;
}
</style>

<script setup>

// Defining the props that I will use in this component
// element is passed in Home.page.vue line 74
// Each element is a message object with a username and a message
defineProps(['element']);

</script>

<template>
    <div class="username text-center pt-2">{{ element.username }}</div>
    <div class="bubble">
        {{ element.msg }}
    </div>
</template>


<style scoped>

.bubble {
    background-color: #3498db;
    color: #fff;
    padding: 10px;
    border-radius: 10px;
    margin-top: 5px;
    text-align: center;
}

.username {
    font-weight: bold;
    margin-bottom: 3px;
}
</style>
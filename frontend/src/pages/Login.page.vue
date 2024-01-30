<script setup>

// Built-in
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// Components
import Navbar from "../components/Navbar.component.vue";

// Utils
import { uploadImage } from '../services/uploadImage';
import { getSamplePictures } from '../services/getSamplePictures';



// The router is used to redirect the user to a different page
const router = useRouter();

// I initialize the username and the image url as empty refs
const username = ref('');
const imageUrl = ref('');

// line 107
const showError = ref(false);

// Variable to check if a sample picture is selected
const sampleSelected = ref(false);

// Variable to check if a file is successfully uploaded
// To know if the user can be redirected to the chat page
const fileUploaded = ref(false);

// Empty array to store the sample pictures
// That will be fetched from the server
let sample_pictures = ref([]);


// When one of the sample picture is selected
// I set the sampleSelected variable to true
const select = () => {
    sampleSelected.value = true;
}



const login = () => {
    // If username is not empty and an image is selected
    if (username.value.trim() !== '' && imageUrl.value.trim() !== '') {
        // Store the username in localStorage
        localStorage.setItem('username', username.value);

        // services/uploadImage.js
        uploadImage(imageUrl, username, fileUploaded, router);

    } else {
        showError.value = true

        // Make the error message disappear after 2 seconds
        setTimeout(() => {
            showError.value = false
        }, 2000);
    }
};


// Assigning the image base64 string to the imageUrl ref
const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        imageUrl.value = reader.result;
    };
};

const handleUpload = () => {
    uploadImage(imageUrl, username, fileUploaded, router);
}

onMounted(async () => {
    // services/getSamplePictures.js
    sample_pictures.value = await getSamplePictures();
});

</script>

<template>
    <Navbar :username="'none'" />
    <div class="text-center py-5 container">
        <form @submit.prevent="login" id="loginForm" class="text-center mx-auto">
            <h4>One click away from chatting !</h4>
            <input v-model="username" type="text" placeholder="Enter your username" class="mx-2"><i
                v-if="username.length > 2" class="bi bi-check-lg"></i>
            <p v-if="showError" style="color: red;">You need to choose a username and a picture ...</p>
            <div v-show="username.length > 2" class="upload">
                <h5 class="py-2">Choose a picture</h5>
                <div v-if="sample_pictures.length > 0" class="d-flex justify-content-center">
                    <div v-for="picture in sample_pictures" :key="picture.id" class="samples_grid">
                        <img class="rounded-circle" :src="'data:image/jpeg;base64,' + picture.data" alt="profile picture"
                            width="100" height="100">
                        <input type="radio" name="picture" :value="'data:image/jpeg;base64,' + picture.data"
                            v-model="imageUrl" @click="select">
                    </div>
                </div>
                <p>Or</p>
                <div v-show="!sampleSelected">
                    <input class="file-upload" type="file" @change="handleFileUpload" /><br>
                    <a class="button my-3" @click="handleUpload">Upload</a>
                </div>
                <!-- Showing button only if a username is entered and a picture is selected or uploaded -->
                <button v-show="username.length > 2 && sampleSelected || username.length > 2 && fileUploaded"
                    class="button">Chat</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
input {
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    width: 20%;
    outline: none;
}

i {
    color: green;
    font-size: 1.5rem;
    vertical-align: middle;
}

.container {
    margin-top: 180px;
}

.file-upload {
    width: fit-content;
}


@media screen and (max-width: 600px) {
    input {
        width: 90%;
    }

    .samples_grid img {
        width: 40px;
        height: 40px;
    }
}
</style>
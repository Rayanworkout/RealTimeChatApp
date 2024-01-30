import axios from 'axios';

// Send the image data to the server
// server.js line 172
export const uploadImage = async (
    
    imageUrl, // ref of type string (base64), Login.page.vue line 18
    
    username, // ref of type string, Login.page.vue line 17
    
    fileUploaded, // ref of type boolean, Login.page.vue line 28
    
    router // router object, Login.page.vue line 14
    
    ) => {
    try {
        // Send the image data to the server using Axios
        const response = await axios.post('http://localhost:3000/pictures/upload', {
            imageData: imageUrl.value,
            username: username.value,
        });

        const success = response.data.success;
        if (success) {
            // Store the username in localStorage
            localStorage.setItem('username', username.value);
            fileUploaded.value = true;
            // Redirect to root url
            router.push('/');
        }

    } catch (error) {
        // Handle errors
        console.error('Error uploading image:', error);
    }
};
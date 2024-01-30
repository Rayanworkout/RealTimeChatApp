import axios from 'axios';

// Fetch all the sample pictures from the server
// server.js line 226 and Login.page.vue line 68
export const getSamplePictures = async () => {
    try {

        const response = await axios.get('http://localhost:3000/pictures/all');
        return response.data.images;

    } catch (error) {
        console.error('Error getting sample pictures:', error);
    }
};
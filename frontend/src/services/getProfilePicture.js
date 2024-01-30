// Axios to perform HTTP requests
import axios from 'axios';


// Username is a sting, picture is a ref

export const getProfilePicture = async (username, picture) => {
    try {

        const response = await axios.get(`http://localhost:3000/picture/${username}`);

        picture.value = response.data.profile_picture;

    } catch (error) {
        console.error('Error getting profile picture:', error);
    }
};
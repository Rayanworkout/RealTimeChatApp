import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  onlineUsers: [],
  messages: [],
  typingUsers: [],

});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";


// We can use socket object both in client and server side
// just by importing the socket.io.js file here
export const socket = io(URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.onlineUsers = state.onlineUsers.splice(state.onlineUsers.indexOf(username), 1);
  state.connected = false;
});


socket.on('logout', (username) => {
  // Remove the user from the online users array
  state.onlineUsers = state.onlineUsers.splice(state.onlineUsers.indexOf(username), 1);
  state.connected = false;
})


// CONSIGNES LIGNE 6
// Emit the event 'connect' along with the username
// so the server can access it
socket.on("user connect", (data) => {
  state.onlineUsers.push(data.username);

  // Add notification when a user is connected for everyone
  // CONSIGNES LIGNE 4
  state.messages.push({ username: 'notification', msg: data.username + ' has joined the chat' });

  // And delete it after 3 seconds
  setTimeout(() => {
    state.messages.splice(state.messages.indexOf({ username: 'notification', msg: data.username + ' has joined the chat' }), 1);
  }, 3000);
});



socket.on("chat message", (data) => {
  state.messages.push(data);
});

socket.on('typing', function(username) {
  console.log(username + ' is typing')
  // Ajouter l'utilisateur à la liste des utilisateurs en train de taper
  if (!state.typingUsers.includes(username)) {
      state.typingUsers.push(username);
  }
  // Supprimer l'utilisateur de la liste après un certain délai
  setTimeout(function() {
      const index = state.typingUsers.indexOf(username);
      if (index !== -1) {
          state.typingUsers.splice(index, 1);
      }
  }, 2000); // ajustez ce délai comme vous le souhaitez
});

// CONSIGNES LIGNE 9
// Listen for 'typing' event
socket.on('typing', (username) => {
  // If the array already contains the user, don't add it again
  if (!state.typingUsers.includes(username)) {
    state.typingUsers.push(username);

    // Remove the user from the array after 3 seconds
    setTimeout(() => {
      state.typingUsers.splice(state.typingUsers.indexOf(username), 1);
    }, 3000);
  }
})
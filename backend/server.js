
// Http server to handle socket connections
const { createServer } = require('http');
const { Server } = require('socket.io');

// Express server to handle HTTP requests
const express = require('express');

// CORS middleware to allow requests from other origins
// Because frontend and backend are not on the same port
const cors = require('cors');

// Libs to deal with SQLite database
// and files
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

// Database object globally accessible in the app
let db;

// Function that is automatically executed when the file is run
// used to create tables and add pictures to the database
(async () => {
  // Open SQLite database connection
  db = await open({
    filename: 'chat.sqlite3',
    driver: sqlite3.Database
  });

  // Create 'messages' table if not exists
  // To store all messages
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT,
      content TEXT
    );
  `);

  // Create 'users' table if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      profile_picture BLOB,
      picture_src TEXT
    );
  `);


  // Add all sample pictures to the database
  // CONSIGNES LIGNE 13
  await db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    data BLOB
  );
`);

  const folderPath = './sample_pictures';

  // Read files from the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    // Loop through each file in the folder
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Read the image file as a buffer
      const imageData = fs.readFileSync(filePath);

      // Convert the buffer to base64
      const base64Data = imageData.toString('base64');

      // Insert the image data into the database
      db.run('INSERT OR IGNORE INTO images (name, data) VALUES (?, ?)', [file, base64Data], (error) => {
        if (error) {
          console.error(`Error inserting ${file} into the database:`, error);
        } else {
          console.log(`${file} inserted into the database.`);
        }
      });
    });
  });

  console.log('Database tables created successfully and pictures added.');
})();


const app = express();

// Using express.json() to parse JSON bodies into JS objects
// and increasing limit because of the base64 pictures format
app.use(express.json({ limit: '10mb' }));

// Using cors middleware to allow requests from other origins
app.use(cors());

// Init the server object
const httpServer = createServer(app);

// And the socket.io object
// Don't forget to allow requests from other origins here TOO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Array to store online users, can also be done with database
const onlineUsers = [];

io.on('connection', (socket) => {

  // Connection event
  socket.on('user connect', (username) => {
    // CONSIGNES LIGNE 4
    console.log(username + ' is now online !');

    // Add user to database if not already in
    db.run('INSERT OR IGNORE INTO users (name) VALUES (?)', [username]);

    // CONSIGNES LIGNE 10
    onlineUsers.push(username);

    io.emit('user connect', {
      // socket.js line 23
      username: username,
      onlineUsers: onlineUsers
    });

    io.on('connection', (socket) => {
      socket.on('user is writing', () => {
        socket.broadcast.emit('user is writing');
      });
    // ajustez ce délai comme vous le souhaitez
  });
    // New messages event
    socket.on('chat message', (data) => {
      // Home.page.vue line 27
      // console.log('message: ' + data.msg);

      // This will emit the event to all connected sockets
      io.emit('chat message', {
        username: data.username,
        msg: data.msg
      });
      // Add the message to the database
      db.run('INSERT INTO messages (author, content) VALUES (?, ?)', [data.username, data.msg]);

    });


    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  socket.on('logout', (username) => {
    console.log(username + ' has disconnected')

    io.emit('logout', username)
  })
});


// Enpoint to allow users to upload their profile picture
// Picture is stored as base64 string in the database
app.post('/pictures/upload', (req, res) => {

  try {
    const imageData = req.body.imageData;
    const username = req.body.username;

    // Add user to database if not already in
    db.run('INSERT OR IGNORE INTO users (name) VALUES (?)', [username]);
    // Update the 'profile_picture' column for the specified user
    db.run('UPDATE users SET profile_picture = ? WHERE name = ?', [imageData, username], (error) => {
      if (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(`Profile picture updated for ${username}`);
        res.status(200).json({ message: 'Profile picture uploaded successfully' });
      }
    });

    console.log(`Profile picture updated for ${username}`);
    res.status(200).json({ success: true, message: 'Profile picture uploaded successfully' });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


});


// Endpoint to get the profile picture of a particular user
// and use it in Home.page.vue line 22
app.get('/picture/:username', async (req, res) => {

  try {
    const username = req.params.username;
    const user = await db.get('SELECT * FROM users WHERE name = ?', [username]);

    if (user) {
      res.status(200).json({ profile_picture: user.profile_picture });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});


// Endpoint to get all the pictures in the database
// and use them in Login.page.vue line 75
app.get('/pictures/all', async (req, res) => {

  try {
    const images = await db.all('SELECT * FROM images');
    res.status(200).json({ images: images });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }



});


app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dist/index.html'));
});


// I define the port either in a .env file or 3000
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

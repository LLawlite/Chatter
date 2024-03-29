const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/db');
const colors = require('colors');
const userRoutes = require('./backend/routes/userRoutes');
const chatRoutes = require('./backend/routes/chatRoutes');
const messageRoutes = require('./backend/routes/messageRoutes');
const app = express();
const helmet = require('helmet');
const {
  notFound,
  errorHandler,
} = require('./backend/middleWare/errorMiddleware');
dotenv.config();

connectDB();

app.use(helmet()); // secures HTTP header returned by the express app
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // so that browser blocks no cors
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Helllo wrold');
// });

app.use('/api/user', userRoutes);

app.use('/api/chat', chatRoutes);

app.use('/api/message', messageRoutes);

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// error handling middle wares

// --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname1, '/frontend/build')));

//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'))
//   );
// } else {
//   app.get('/', (req, res) => {
//     res.send('API is running..');
//   });
// }

// --------------------------deployment------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server started on Port ${PORT}`.yellow.bold)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'https://main--tubular-longma-59b1cd.netlify.app',
    // origin: 'https://lucent-cascaron-b0f8ee.netlify.app/',
    // origin: 'https://chatter-4f5d2.web.app',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    // console.log('User Joined Room: ' + room);
  });
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    // if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return; // when send by us just return

      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

  //cleaning up the socket if not done it will consume lots of bandwidth

  socket.off('setup', () => {
    // console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});

import io from 'socket.io-client';

const socket = io('https://chat-server-ros-a1684ddf6fd2.herokuapp.com'); // Підключення до сервера Socket.IO

export default socket;
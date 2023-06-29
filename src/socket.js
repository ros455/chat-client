import io from 'socket.io-client';

const socket = io('http://localhost:4444'); // Підключення до сервера Socket.IO

export default socket;
// Frontend code example
const { io } = require('socket.io-client');

const socket = io('http://localhost:3333');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('mqttData', (data) => {
  console.log('Received MQTT data:', data);
  // Xử lý dữ liệu nhận được từ MQTT tại đây
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
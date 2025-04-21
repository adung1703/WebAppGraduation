const mqtt = require('mqtt');

// Thông tin HiveMQ Cloud
const mqttServer = '694db29983f8479bafa92337d5de0db1.s1.eu.hivemq.cloud';
const mqttPort = 8883;
const mqttUser = 'adung1703';
const mqttPassword = 'Adung1703';
const mqttTopic = 'esp32/test';

// Cấu hình MQTT
const mqttOptions = {
    port: mqttPort,
    username: mqttUser,
    password: mqttPassword,
    protocol: 'mqtts', // Sử dụng MQTT over TLS/SSL (mqtts)
    rejectUnauthorized: false // Chỉ dùng cho test, bỏ qua xác thực chứng chỉ
};

// Tạo client MQTT
const client = mqtt.connect('mqtts://694db29983f8479bafa92337d5de0db1.s1.eu.hivemq.cloud:8883', mqttOptions);

// Xử lý sự kiện kết nối
client.on('connect', () => {
    console.log('Connected to MQTT Broker!');
});

// Xử lý sự kiện lỗi
client.on('error', (error) => {
    console.error('Connection error: ', error);
});

// Hàm tạo dữ liệu giả lập
function generateSensorData() {
    const timestamp = new Date().toISOString(); // Thời gian hiện tại
    const temperature = (Math.floor(Math.random() * (350 - 200 + 1)) + 200) / 10;  // 20.0 - 35.0°C
    const humidity = (Math.floor(Math.random() * (800 - 400 + 1)) + 400) / 10;     // 40.0 - 80.0%
    const broadband = Math.floor(Math.random() * 50000);          // 0 - 50000 lux
    const infrared = Math.floor(Math.random() * 10000);           // 0 - 10000 lux
    const lux = Math.floor(Math.random() * 30000);                // 0 - 30000 lux
    const UVA = (Math.floor(Math.random() * 4000) / 100);         // 0.00 - 40.00
    const UVB = (Math.floor(Math.random() * 4000) / 100);         // 0.00 - 40.00
    const UVI = (Math.floor(Math.random() * 110) / 10);           // 0.0 - 11.0

    return {
        timestamp: timestamp,
        temperature: temperature,
        humidity: humidity,
        broadband: broadband,
        infrared: infrared,
        lux: lux,
        UVA: UVA,
        UVB: UVB,
        UVI: UVI
    };
}

// Hàm gửi dữ liệu lên MQTT
function publishData() {
    const sensorData = generateSensorData();
    const payload = JSON.stringify(sensorData); // Chuyển đổi object thành chuỗi JSON

    client.publish(mqttTopic, payload, (err) => {
        if (err) {
            console.error('Publish error: ', err);
        } else {
            console.log('Sending: ', payload);
        }
    });
}

// Thiết lập gửi dữ liệu định kỳ
setInterval(publishData, 5000); // Gửi mỗi 5 giây
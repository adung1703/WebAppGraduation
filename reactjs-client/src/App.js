// src/App.js
import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';
import mqtt from 'mqtt';
import './App.css';

const App = () => {
  // State lưu trữ dữ liệu từ MQTT
  const [sensorData, setSensorData] = useState({
    timestamp: '',
    temperature: 0,
    humidity: 0,
    broadband: 0,
    infrared: 0,
    lux: 0,
    UVA: 0,
    UVB: 0,
    UVI: 0
  });

  // Cấu hình MQTT client
  useEffect(() => {
    // Thay thế URL của MQTT broker của bạn tại đây
    // Thông tin HiveMQ Cloud
    const mqttServer = '694db29983f8479bafa92337d5de0db1.s1.eu.hivemq.cloud';
    const mqttPort = 8884;
    const mqttUser = 'adung1703';
    const mqttPassword = 'Adung1703';
    const mqttTopic = 'esp32/test';

    const mqttOptions = {
      port: mqttPort,
      username: mqttUser,
      password: mqttPassword,
      clean: true,
      protocol: 'wss', // Sử dụng MQTT over TLS/SSL (mqtts)
      rejectUnauthorized: false // Chỉ dùng cho test, bỏ qua xác thực chứng chỉ
    };

    const mqttClient = mqtt.connect(`wss://${mqttServer}:${mqttPort}/mqtt`, mqttOptions);
    
    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Thay thế tên topic của bạn tại đây
      mqttClient.subscribe(mqttTopic);
    });

    mqttClient.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received data:', data);
        setSensorData(data);
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  // Hàm chuyển đổi giá trị để phù hợp với thang đo gauge (0-1)
  const normalizeTemperature = (temp) => {
    // Giả sử thang đo từ -10 đến 50 độ C
    return (temp + 10) / 60;
  };

  const normalizeHumidity = (humidity) => {
    // Độ ẩm từ 0-100%
    return humidity / 100;
  };

  const normalizeLux = (lux) => {
    // Giả sử thang đo từ 0 đến 10000 lux
    return Math.min(lux / 10000, 1);
  };

  const normalizeUV = (uv) => {
    // Giả sử thang đo UV từ 0 đến 12
    return uv / 12;
  };

  return (
    <div className="dashboard">
      <h1>MQTT Sensor Dashboard</h1>
      <p className="timestamp">Last update: {sensorData.timestamp}</p>

      <div className="gauges-container">
        <div className="gauge-card">
          <h2>Temperature (°C)</h2>
          <GaugeChart
            id="temperature-gauge"
            nrOfLevels={5}
            colors={["#00FF00", "#FFBF00", "#FF0000"]}
            arcWidth={0.3}
            percent={normalizeTemperature(sensorData.temperature)}
            textColor="#000000"
            formatTextValue={() => sensorData.temperature + '°C'}
          />
        </div>

        <div className="gauge-card">
          <h2>Humidity (%)</h2>
          <GaugeChart
            id="humidity-gauge"
            nrOfLevels={5}
            colors={["#FF0000", "#FFBF00", "#00FF00"]}
            arcWidth={0.3}
            percent={normalizeHumidity(sensorData.humidity)}
            textColor="#000000"
            formatTextValue={() => sensorData.humidity + '%'}
          />
        </div>

        <div className="gauge-card">
          <h2>Light (Lux)</h2>
          <GaugeChart
            id="lux-gauge"
            nrOfLevels={5}
            colors={["#FFBF00", "#00FF00"]}
            arcWidth={0.3}
            percent={normalizeLux(sensorData.lux)}
            textColor="#000000"
            formatTextValue={() => sensorData.lux}
          />
        </div>

        <div className="gauge-card">
          <h2>Broadband</h2>
          <GaugeChart
            id="broadband-gauge"
            nrOfLevels={5}
            colors={["#FFBF00", "#00FF00"]}
            arcWidth={0.3}
            percent={normalizeLux(sensorData.broadband / 100)}
            textColor="#000000"
            formatTextValue={() => sensorData.broadband}
          />
        </div>

        <div className="gauge-card">
          <h2>Infrared</h2>
          <GaugeChart
            id="infrared-gauge"
            nrOfLevels={5}
            colors={["#FFBF00", "#00FF00"]}
            arcWidth={0.3}
            percent={normalizeLux(sensorData.infrared / 100)}
            textColor="#000000"
            formatTextValue={() => sensorData.infrared}
          />
        </div>

        <div className="gauge-card">
          <h2>UV Index</h2>
          <GaugeChart
            id="uvi-gauge"
            nrOfLevels={5}
            colors={["#00FF00", "#FFBF00", "#FF0000"]}
            arcWidth={0.3}
            percent={normalizeUV(sensorData.UVI)}
            textColor="#000000"
            formatTextValue={() => sensorData.UVI}
          />
        </div>

        <div className="gauge-card">
          <h2>UVA</h2>
          <GaugeChart
            id="uva-gauge"
            nrOfLevels={5}
            colors={["#00FF00", "#FFBF00", "#FF0000"]}
            arcWidth={0.3}
            percent={normalizeUV(sensorData.UVA / 10)}
            textColor="#000000"
            formatTextValue={() => sensorData.UVA}
          />
        </div>

        <div className="gauge-card">
          <h2>UVB</h2>
          <GaugeChart
            id="uvb-gauge"
            nrOfLevels={5}
            colors={["#00FF00", "#FFBF00", "#FF0000"]}
            arcWidth={0.3}
            percent={normalizeUV(sensorData.UVB / 10)}
            textColor="#000000"
            formatTextValue={() => sensorData.UVB}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
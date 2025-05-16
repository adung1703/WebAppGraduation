// src/components/Live/MqttService.js
import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const useMqttService = () => {
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

  useEffect(() => {
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
      protocol: 'wss',
      rejectUnauthorized: false
    };

    const mqttClient = mqtt.connect(`wss://${mqttServer}:${mqttPort}/mqtt`, mqttOptions);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
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

  return sensorData;
};

export default useMqttService;
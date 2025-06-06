// src/components/Live/Live.js
import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';
import mqtt from 'mqtt';
import useMqttService from './MqttService'; 

const Live = () => {

  const sensorData = useMqttService(); 

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
    <div className="body-container">
      <h1 className="project-heading">
        Thông số môi trường hiện tại ở văn phòng <strong className="purple">Khoa KTMT </strong>
      </h1>
      <p className="timestamp">Last update: {sensorData.timestamp || new Date().toLocaleString()}</p>

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

export default Live;
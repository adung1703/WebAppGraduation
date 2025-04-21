const mqtt = require("mqtt");
const client = mqtt.connect("mqtts://694db29983f8479bafa92337d5de0db1.s1.eu.hivemq.cloud:8883", {
  username: "adung1703",
  password: "Adung1703",
});

client.on("connect", () => {
  console.log("Connected to MQTT Broker");
  client.subscribe("esp32/test", (err) => {
    if (!err) console.log("Subscribed to $SYS/#");
  });
});

client.on("message", (topic, message) => {
  console.log(`${topic}: ${message.toString()}`);
});

const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const client = mqtt.connect(process.env.MQTT_URL,{
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: `mqtt-logger-${Date.now()}`, // Unique client ID
});

client.on('connect', async () => {
  console.log('Connected to MQTT broker');
  // Fetch all imeinumbers from MqttCredentials
  const devices = await prisma.mqttCredentials.findMany();
  devices.forEach(device => {
    const dataTopic = `device/${device.imeinumber}/data`;
    const cmdRespTopic = `device/${device.imeinumber}/cmd/response`;
    client.subscribe([dataTopic, cmdRespTopic], (err) => {
      if (err) {
        console.error('Subscription error:', err);
      } else {
        console.log(`Subscribed to topics: ${dataTopic}, ${cmdRespTopic}`);
      }
    });
  });
});

client.on('message', async (topic, message) => {
  try {
    let payload;
    let imeinumber = '';
    let messageType = '';
    try {
      payload = JSON.parse(message.toString());
      imeinumber = payload.imeinumber || '';
      messageType = payload.messageType || '';
    } catch (e) {
      payload = { raw: message.toString() };
    }
    await prisma.deviceLog.create({
      data: {
        imeinumber,
        receivedAt: new Date(),
        messageType,
        payload,
      },
    });
    console.log(`Logged message from topic: ${topic}`);
  } catch (error) {
    console.error('Error saving to DeviceLog:', error);
  }
});
// simulate-device.js
// Simulates an MQTT device for solar irrigation pumps
const axios = require('axios');
const mqtt = require('mqtt');
const CronJob = require('cron').CronJob;

const IMEINUMBER = process.env.IMEINUMBER;
const HTTP_SERVER = process.env.HTTP_SERVER;
const CRON_EXPRESSION = process.env.CRON_EXPRESSION || '0 */15 * * * *';

async function fetchMqttCredentials(imeinumber) {
  const url = `${HTTP_SERVER}/api/devices/mqtt-credentials?imeinumber=${imeinumber}`;
  const response = await axios.get(url);
  return response.data;
}

function generateSensorData() {
  return {
    imeinumber: IMEINUMBER,
    messageType: 'sensorData',
    dcVolts: (Math.random() * 10 + 40).toFixed(2), // 40-50V
    dcAmps: (Math.random() * 5 + 10).toFixed(2),   // 10-15A
    pvVolts: (Math.random() * 20 + 300).toFixed(2),// 300-320V
    pvCurrent: (Math.random() * 2 + 8).toFixed(2), // 8-10A
    lpm: (Math.random() * 20 + 80).toFixed(2),     // 80-100 LPM
    totalDischarge: (Math.random() * 100 + 500).toFixed(2), // 500-600 L
    timestamp: new Date().toISOString(),
  };
}

(async () => {
  try {
    console.log('Fetching MQTT credentials...');
    const creds = await fetchMqttCredentials(IMEINUMBER);
    const mqttUrl = `mqtt://${creds.host}:${creds.port}`;
    const options = {
      username: creds.username,
      password: creds.password,
      clientId: IMEINUMBER,
    };
    const client = mqtt.connect(mqttUrl, options);
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to command topic for incoming commands
      const cmdTopic = `device/${IMEINUMBER}/cmd`;
      client.subscribe(cmdTopic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to command topic:', cmdTopic);
        }
      });
      // Replace setInterval with CronJob (every 15 minutes)
      const job = new CronJob(CRON_EXPRESSION, () => {
        const data = generateSensorData();
        const dataTopic = `device/${IMEINUMBER}/data`;
        client.publish(dataTopic, JSON.stringify(data));
        console.log('Published data:', data);
      });
      job.start();
    });
    client.on('message', (topic, message) => {
      console.log(`Received command on ${topic}:`, message.toString());
      // Respond to command
      const response = {
        imeinumber: IMEINUMBER,
        messageType: 'cmdResponse',
        response: 'Command received',
        original: message.toString(),
        timestamp: new Date().toISOString(),
      };
      const cmdRespTopic = `device/${IMEINUMBER}/cmd/response`;
      client.publish(cmdRespTopic, JSON.stringify(response));
      console.log('Published command response:', response);
    });
    client.on('error', (err) => {
      console.error('MQTT Error:', err);
    });
  } catch (err) {
    console.error('Failed to start device simulator:', err);
  }
})();

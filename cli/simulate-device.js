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
  // Simulate realistic values for each field
  return {
    TIM: new Date().toLocaleString('en-GB', { hour12: false }), // dd/mm/yyyy, hh:mm:ss
    FWV: (Math.random() * 2 + 1).toFixed(2),    // Firmware version: 1.00 - 3.00
    HWV: (Math.random() * 2 + 1).toFixed(2),    // Hardware version: 1.00 - 3.00
    DRC: Math.floor(Math.random() * 100),       // Drive code: 0-99
    OPV: (Math.random() * 100 + 300).toFixed(2),// Output voltage: 300-400V
    OPC: (Math.random() * 10 + 10).toFixed(2),  // Output current: 10-20A
    DCV: (Math.random() * 20 + 300).toFixed(2), // Input voltage: 300-320V
    DCC: (Math.random() * 5 + 10).toFixed(2),   // Input current: 10-15A
    FRQ: (Math.random() * 10 + 40).toFixed(2),  // Frequency: 40-50Hz
    PWR: (Math.random() * 500 + 1000).toFixed(2), // Output power: 1000-1500W
    DPR: (Math.random() * 500 + 1000).toFixed(2), // Input power: 1000-1500W
    FLC: Math.floor(Math.random() * 10),        // Fault code: 0-9
    STS: Math.floor(Math.random() * 2),         // Status: 0 or 1
    TEP: (Math.random() * 20 + 30).toFixed(2),  // Temperature: 30-50°C
    FLW: (Math.random() * 20 + 80).toFixed(2),  // Flow: 80-100 LPM
    CKW: (Math.random() * 100 + 500).toFixed(2),// Cumulative KWH: 500-600
    CWD: (Math.random() * 100 + 500).toFixed(2),// Cumulative Flow: 500-600
    CHR: (Math.random() * 10 + 100).toFixed(2), // Cumulative Hours: 100-110
    TKW: (Math.random() * 10 + 10).toFixed(2),  // Today KWH: 10-20
    TWD: (Math.random() * 10 + 10).toFixed(2),  // Today Flow: 10-20
    THR: (Math.random() * 2 + 1).toFixed(2),    // Today Hours: 1-3
    RSI: Math.floor(Math.random() * 31 + 70),   // Signal strength: 70-100
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

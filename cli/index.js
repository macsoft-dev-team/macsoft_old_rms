const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');
const moment = require('moment');
const momentTz = require('moment-timezone'); // Add this line
const DATETIMEFORMAT = 'DD/MM/YYYY HH:mm:ss'; // Adjust format as needed

const prisma = new PrismaClient();
const client = mqtt.connect(`${process.env.RMS_MQTT_HOST}:${process.env.RMS_MQTT_PORT}`, {
  username: process.env.RMS_MQTT_USERNAME,
  password: process.env.RMS_MQTT_PASSWORD,
  clientId: `mqtt-logger-${Date.now()}`,
});

client.on('connect', async () => {
  console.log("Connected to MQTT broker");
  // Fetch all devices and store as { macsoftmqttpubtopicdata: { macsoftmqttsubtopiccmd, tablename } }
  const devicesList = await prisma.device.findMany();
  const devicesMap = {};
  devicesList.forEach((device) => {
    devicesMap[device.macsoftmqttpubtopicdata] = {
      macsoftmqttsubtopiccmd: device.macsoftmqttsubtopiccmd,
      tablename: device.tablename,
      imeinumber: device.imeinumber,
    };
    // Subscribe to both data and command topics
    client.subscribe(
      [device.macsoftmqttpubtopicdata, device.macsoftmqttsubtopiccmd],
      (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log(
            `Subscribed to topics: ${device.macsoftmqttpubtopicdata}, ${device.macsoftmqttsubtopiccmd}`
          );
        }
      }
    );
  });
  client.devicesMap = devicesMap;
});

client.on('message', async (topic, message) => {
  try {
    const messageStr = message.toString().trim();
    let parsedData = {};
    try {
      parsedData = JSON.parse(messageStr);

      // Find tablename by topic
      const tablename = client.devicesMap.hasOwnProperty(topic) ? client.devicesMap.has[topic].tablename : undefined;
      const imeinumber = client.devicesMap.hasOwnProperty(topic) ? client.devicesMap.has[topic].imeinumber : undefined;

      if (tablename !== undefined && parsedData.TIM !== undefined) {
        // const timestamp =  moment(parsedData.TIM, DATETIMEFORMAT).add(5, 'hours').add(30, 'minutes').toDate();
        const timestamp = moment(parsedData.TIM, DATETIMEFORMAT).toDate();
        // Compose deviceData for Prisma
        const deviceData = {
          imeinumber: imeinumber,
          timestamp: timestamp,
          firmwareVersion: parsedData.FWV ? parseFloat(parsedData.FWV) : null,
          hardwareVersion: parsedData.HWV ? parseFloat(parsedData.HWV) : null,
          driveCode: parsedData.DRC ? parseInt(parsedData.DRC) : null,
          outputVoltage: parsedData.OPV ? parseFloat(parsedData.OPV) : null,
          outputCurrent: parsedData.OPC ? parseFloat(parsedData.OPC) : null,
          inputVoltage: parsedData.DCV ? parseFloat(parsedData.DCV) : null,
          inputCurrent: parsedData.DCC ? parseFloat(parsedData.DCC) : null,
          frequency: parsedData.FRQ ? parseFloat(parsedData.FRQ) : null,
          outputPower: parsedData.PWR ? parseFloat(parsedData.PWR) : null,
          inputPower: parsedData.DPR ? parseFloat(parsedData.DPR) : null,
          faultCode: parsedData.FLC ? parseInt(parsedData.FLC) : null,
          status: parsedData.STS ? parseInt(parsedData.STS) : null,
          temperature: parsedData.TEP ? parseFloat(parsedData.TEP) : null,
          flow: parsedData.FLW ? parseFloat(parsedData.FLW) : null,
          cumulativeKWH: parsedData.CKW ? parseFloat(parsedData.CKW) : null,
          cumulativeFlow: parsedData.CWD ? parseFloat(parsedData.CWD) : null,
          cumulativeHours: parsedData.CHR ? parseFloat(parsedData.CHR) : null,
          todayKWH: parsedData.TKW ? parseFloat(parsedData.TKW) : null,
          todayFlow: parsedData.TWD ? parseFloat(parsedData.TWD) : null,
          todayHours: parsedData.THR ? parseFloat(parsedData.THR) : null,
          signalStrength: parsedData.RSI ? parseInt(parsedData.RSI) : null,
        };

        // Use Prisma model dynamically for insert
        const model = prisma[tablename];
        if (!model) {
          console.error(`Prisma model for table ${tablename} not found`);
          return;
        }
        await model.create({ data: deviceData });

        // update device model 
        delete deviceData.imeinumber
        await prisma.device.update({
          where: { imeinumber: imeinumber },
          data: deviceData,
        });

      }

    } catch (e) {
      console.error('Failed to parse JSON:', e.message);
      return;
    }

  } catch (error) {
    console.error('Error processing message:', error);
  }
});
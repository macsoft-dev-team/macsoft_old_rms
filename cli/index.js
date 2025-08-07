const mqtt = require('mqtt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const client = mqtt.connect(`${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: `mqtt-logger-${Date.now()}`, // Unique client ID
});

client.on('connect', async () => {
  console.log('Connected to MQTT broker');
  // Fetch all imeinumbers from device and transform to object
  const devicesList = await prisma.device.findMany();
  const devices = {};
  devicesList.forEach(device => {
    devices[device.pubTopicData] = device;
    devices[device.subTopicCmd] = device;
    const dataTopic = device.pubTopicData;
    const cmdSubTopic = device.subTopicCmd;
    client.subscribe([dataTopic, cmdSubTopic], (err) => {
      if (err) {
        console.error('Subscription error:', err);
      } else {
        console.log(`Subscribed to topics: ${dataTopic}, ${cmdSubTopic}`);
      }
    });
  });
  
  // Store devices object globally for message handler
  client.devicesMap = devices;
});

client.on('message', async (topic, message) => {
  try {
    const messageStr = message.toString().trim();
    
    let payload;
    let parsedData = {};
    
    try {
      // Parse as JSON - the MQTT format is valid JSON
      parsedData = JSON.parse(messageStr);
      payload = parsedData;
    } catch (e) {
      // Fallback for invalid JSON
      console.error('Failed to parse JSON:', e.message);
      payload = { raw: messageStr };
    }

    // Get device info from topic
    const device = client.devicesMap[topic];
    if (!device) {
      console.log(`No device found for topic: ${topic}`);
      return;
    }

    const imeinumber = device.imeinumber;
    const tableName = device.tablename;
    
    // Insert into device-specific table if tableName exists
    if (tableName && parsedData.TIM) {
      const deviceData = {
        imeinumber,
        timestamp: new Date(parsedData.TIM.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')),
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

      // Insert into device table using raw query
      await prisma.$executeRawUnsafe(
        `INSERT INTO ${tableName} (
          imeinumber, timestamp, firmwareVersion, hardwareVersion, driveCode, outputVoltage, outputCurrent,
          inputVoltage, inputCurrent, frequency, outputPower, inputPower, faultCode, status, temperature,
          flow, cumulativeKWH, cumulativeFlow, cumulativeHours, todayKWH, todayFlow, todayHours, signalStrength
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        imeinumber,
        deviceData.timestamp,
        deviceData.firmwareVersion,
        deviceData.hardwareVersion,
        deviceData.driveCode,
        deviceData.outputVoltage,
        deviceData.outputCurrent,
        deviceData.inputVoltage,
        deviceData.inputCurrent,
        deviceData.frequency,
        deviceData.outputPower,
        deviceData.inputPower,
        deviceData.faultCode,
        deviceData.status,
        deviceData.temperature,
        deviceData.flow,
        deviceData.cumulativeKWH,
        deviceData.cumulativeFlow,
        deviceData.cumulativeHours,
        deviceData.todayKWH,
        deviceData.todayFlow,
        deviceData.todayHours,
        deviceData.signalStrength
      );
    }

    console.log(`Processed message from topic: ${topic} for device: ${imeinumber}`);
  } catch (error) {
    console.error('Error processing message:', error);
  }
});
const mqtt = require("mqtt");
const { PrismaClient } = require("@prisma/client");
const moment = require("moment");
const DATETIMEFORMAT = "DD/MM/YYYY HH:mm:ss";

const prisma = new PrismaClient();
const client = mqtt.connect(
  `${process.env.RMS_MQTT_HOST}:${process.env.RMS_MQTT_PORT}`,
  {
    username: process.env.RMS_MQTT_USERNAME,
    password: process.env.RMS_MQTT_PASSWORD,
    clientId: `mqtt-logger-${Date.now()}`,
  }
);

// Messages can arrive before the initial device sync completes.
client.devicesMap = {};

client.on("connect", async () => {
  //console.log("Connected to MQTT broker");
  // Fetch all devices and store as { macsoftmqttpubtopicdata: { macsoftmqttpubtopiccmd, tablename } }
  const devicesList = await prisma.device.findMany();
  const devicesMap = {};
  devicesList.forEach((device) => {
    const dataTopic =
      typeof device.macsoftmqttpubtopicdata === "string"
        ? device.macsoftmqttpubtopicdata.trim()
        : "";
    const commandTopic =
      typeof device.macsoftmqttpubtopiccmd === "string"
        ? device.macsoftmqttpubtopiccmd.trim()
        : "";
    const topics = [dataTopic, commandTopic].filter(Boolean);

    if (dataTopic) {
      devicesMap[dataTopic] = {
        macsoftmqttpubtopiccmd: commandTopic || null,
        tablename: device.tablename,
        imeinumber: device.imeinumber,
      };
    }

    if (topics.length === 0) {
      console.warn(
        `Skipping MQTT subscription for device ${device.imeinumber}: no valid publish topics configured`
      );
      return;
    }

    client.subscribe(topics, (err) => {
      if (err) {
        console.error(
          `Subscription error for device ${device.imeinumber}:`,
          err
        );
      } else {
        console.log(`Subscribed to topics: ${topics.join(", ")}`);
      }
    });
  });
  client.devicesMap = devicesMap;
});

client.on("message", async (topic, message) => {
  // Log the data received
  //console.log(`Data received on topic '${topic}':`, message.toString());
  const messageStr = message.toString().trim();
  // Check if topic is /cmd/response
  const cmdResponseMatch = topic.match(/^device\/(\d+)\/cmd\/response/);
  if (cmdResponseMatch) {
    const imeinumber = cmdResponseMatch[1];
    // Log the /cmd/response message
    console.log(`CMD/RESPONSE for imeinumber ${imeinumber}: ${messageStr}`);
    try {
      const _device = await prisma.device.findUnique({
        where: { imeinumber: imeinumber },
      });
      await prisma.command.create({
        data: {
          response: messageStr,
          imeinumber: imeinumber,
          deviceId: _device ? _device.id : null,
          payload: "", // No payload for response-only
          type: "RESPONSE",
          // deviceId can be set if you want to look up by imeinumber
        },
      });
      console.log(`Stored command response for imeinumber ${imeinumber}`);
    } catch (err) {
      console.error("Failed to store command response:", err.message);
    }
    return;
  }

  // Otherwise, try to parse as JSON (for data topics)
  let parsedData = {};
  let isJson = false;
  try {
    parsedData = JSON.parse(messageStr);
    isJson = true;
  } catch (e) {
    isJson = false;
  }

  if (isJson) {
    // ...existing code for JSON handling...
    const devicesMap = client.devicesMap || {};
    const hasTopic = Object.prototype.hasOwnProperty.call(devicesMap, topic);
    const tablename = hasTopic
      ? devicesMap[topic].tablename
      : undefined;
    const imeinumber = hasTopic
      ? devicesMap[topic].imeinumber
      : undefined;
    const prismaModelName =
      tablename && /^devicelog_\d+$/i.test(tablename)
        ? `deviceLog_${tablename.split("_")[1]}`
        : tablename;
    if (prismaModelName !== undefined && parsedData.TIM !== undefined) {
      const timestamp = moment(parsedData.TIM, DATETIMEFORMAT).toDate();
      const rawFWV = parsedData.FWV !== undefined && parsedData.FWV !== null ? parseFloat(parsedData.FWV) : NaN;
      const rawHWV = parsedData.HWV !== undefined && parsedData.HWV !== null ? parseFloat(parsedData.HWV) : NaN;
      const firmwareVersion = !isNaN(rawFWV) ? rawFWV : null;
      const hardwareVersion = !isNaN(rawHWV) ? rawHWV : null;

      const deviceData = {
        imeinumber: imeinumber,
        timestamp: timestamp,
        firmwareVersion: firmwareVersion,
        hardwareVersion: hardwareVersion,
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
      const model = prisma[prismaModelName];
      if (!model) {
        console.error(`Prisma model for table ${prismaModelName} not found`);
        return;
      }
      await model.create({ data: deviceData });
      const updateData = { ...deviceData };
      delete updateData.imeinumber;
      if (parsedData.FWV === undefined || isNaN(rawFWV)) {
        delete updateData.firmwareVersion;
      }
      if (parsedData.HWV === undefined || isNaN(rawHWV)) {
        delete updateData.hardwareVersion;
      }
      await prisma.device.update({
        where: { imeinumber: imeinumber },
        data: updateData,
      });
    }
  } else {
    // For other non-JSON messages, just log
    console.log(`Non-JSON message received on topic '${topic}': ${messageStr}`);
  }
});

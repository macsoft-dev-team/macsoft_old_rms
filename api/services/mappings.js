// Device Service
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const mqtt = require("mqtt");

const getAllDevices = async (skip, take, filter, user) => {
  try {
    const { role, customerId } = user;

    const params = {};
    // Ensure skip is a non-negative integer
    if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
    if (take) params.take = parseInt(take);

    const getStatus = (_status) => {
      switch (_status) {
        case "OFFLINE":
          return 0;
        case "ONLINE":
          return 1;
        case "FAULT":
          return 2;
        default:
          return null;
      }
    };
    // Build where clause
    let where = {};
    if (filter) {
      where.AND = [
        filter.search && {
          OR: [
            { imeinumber: { contains: filter.search } },
            { snausername: { contains: filter.search } },
            { simnumber: { contains: filter.search } },
          ],
        },
        filter.status && { status: getStatus(filter.status) },
        filter.manufacturer && { customerId: filter.manufacturer || 0 },
      ].filter(Boolean);
    }

    // Restrict by customerId for non-admin users
    if (role !== "MACSOFT_ADMIN" && role !== "MACSOFT_USER") {
      where.customerId = customerId;
    }

    params.where = where;
    params.select = {
      id: true,
      imeinumber: true,
      snamqtturl: true,
      snamqttusername: true,
      snamqttpassword: true,
      snamqttpubtopicdata: true,
      snamqttsubtopiccmd: true,
    };
    const count = await prisma.device.count({ where: params.where });
    const devices = await prisma.device.findMany(params);
    return { devices, count };
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw new Error("Could not fetch devices");
  }
};

const getDeviceById = async (imeinumber) => {
  return prisma.device.findUnique({
    where: { imeinumber },
    select: {
      id: true,
      imeinumber: true,
      snamqtturl: true,
      snamqttusername: true,
      snamqttpassword: true,
      snamqttpubtopicdata: true,
      snamqttsubtopiccmd: true,
    },
  });
};

const updateDevice = async (imeinumber, data) => {
  return prisma.device.update({ where: { imeinumber }, data });
};

const createDeviceMapping = async (data) => {
  const { imeinumber, snamqtturl, snamqttusername, snamqttpassword, snamqttpubtopicdata, snamqttsubtopiccmd, snamqttsubtopiccmdresponse } = data;
  return prisma.device.upsert({
    where: { imeinumber },
    update: {
      snamqtturl,
      snamqttusername,
      snamqttpassword,
      snamqttpubtopicdata,
      snamqttsubtopiccmd,
      snamqttsubtopiccmdresponse,
    },
    create: {
      imeinumber,
      snamqtturl,
      snamqttusername,
      snamqttpassword,
      snamqttpubtopicdata,
      snamqttsubtopiccmd,
      snamqttsubtopiccmdresponse,
    },
  });
};

const publishSnaDetails = async (imeinumber) => {
  const device = await prisma.device.findUnique({
    where: { imeinumber },
  });

  if (!device) {
    throw new Error("Device not found");
  }

  if (!device.snamqtturl || !device.snamqttusername) {
    throw new Error("SNA details are not configured for this device");
  }

  // Construct payload
  const clientid = `d:${device.snamqttusername}`;
  const password = device.snamqttpassword || "";
  const payload = `,"SCOM:${device.snamqtturl}","SUSR:${device.snamqttusername}","SCID:${clientid}","SPWD:${password}","SSPT:1"`;

  const mqtt_server = process.env.MQTT_BROKER_URL || `mqtt://mqtt.macsoftautomations.in`;
  const creds = {
    username: process.env.MQTT_USERNAME || "admin",
    password: process.env.MQTT_PASSWORD || "admin",
    clientId: `web-publish-${Date.now()}`,
  };

  const client = mqtt.connect(mqtt_server, creds);

  await new Promise((resolve, reject) => {
    client.on("connect", () => {
      client.publish(
        `device/${device.imeinumber}/cmd`,
        payload,
        {
          qos: 1,
          retain: true,
        },
        (err) => {
          client.end();
          if (err) {
            console.error("MQTT publish error:", err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
    client.on("error", (err) => {
      client.end();
      reject(err);
    });
  });

  // Log in command table for audit trail
  const command = await prisma.command.create({
    data: {
      imeinumber: device.imeinumber,
      deviceId: device.id,
      payload: payload,
      type: "SNA_CONFIG",
      response: "",
    },
  });

  return { success: true, command };
};

module.exports = {
  getAllDevices,
  getDeviceById,
  updateDevice,
  createDeviceMapping,
  publishSnaDetails,
};

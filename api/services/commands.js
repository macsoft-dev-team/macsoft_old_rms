const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const mqtt = require("mqtt");

const getAllCommandsByDeviceId = async (skip, take, filter, deviceId) => {
  const params = {
    where: {},
  };
  if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
  if (take) params.take = parseInt(take);
  if (deviceId) {
    params.where.deviceId = deviceId;
  }
  const count = await prisma.command.count({
    where: params.where,
  });
  const commands = await prisma.command.findMany({
    where: params.where,
    ...params,
    orderBy: { createdAt: "desc" },
    include: { device: true },
  });

  return { commands, count };
};

const createCommand = async (commandData, user) => {
  try {
    const command = await prisma.command.create({
      data: { ...commandData, response: "" },
      include: { device: true },
    });
    const _device = await prisma.device.findUnique({
      where: { imeinumber: command.imeinumber },
    });
    console.log(_device);
 /*    const mqtt_server = `${process.env.MQTT_BROKER_URL}`;
    const creds = {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    }; */
     const mqtt_server = `mqtt://mqtt.macsoftautomations.in`;
     const creds = {
       username: "admin",
       password: "admin",
       clientId: "mqttadmin",
     };
    const client = mqtt.connect(mqtt_server, creds);
    console.log(client);
    let _payload = JSON.stringify(command.payload);
    client.on("connect", () => {
      client.publish(`device/${_device.imeinumber}/cmd`, _payload);
    });

    return command;
  } catch (error) {
    console.error("Error creating command:", error);
    throw new Error("Could not create command");
  }
};

module.exports = {
  getAllCommandsByDeviceId,
  createCommand,
};

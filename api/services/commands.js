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
    orderBy: { createdAt: "asc" },
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
    const mqtt_server = `mqtt://mqtt.macsoftautomations.in`;
    const creds = {
      username: "admin",
      password: "admin",
      clientId: "mqttadmin",
    };
    const client = mqtt.connect(mqtt_server, creds);
    console.log(client);
    client.on('connect', () => {
      client.publish(`device/${_device.imeinumber}/cmd`, JSON.stringify(command));
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

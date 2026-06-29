const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const mqtt = require("mqtt");

const getAllCommandsByDeviceId = async (skip, take, filter, deviceId) => {
  const params = {
    where: {},
  };
  const parsedTake = parseInt(take);
  const parsedSkip = parseInt(skip);

  if (!isNaN(parsedTake)) {
    params.take = parsedTake;
  }
  if (!isNaN(parsedSkip)) {
    params.skip = (parsedSkip - 1) * (isNaN(parsedTake) ? 10 : parsedTake) || 0;
  }

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
    const _device = await prisma.device.findUnique({
      where: { imeinumber: commandData.imeinumber },
    });
    /*   const mqtt_server = `${process.env.MQTT_BROKER_URL}`;
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
    let _payload = commandData.payload;
    await new Promise((resolve, reject) => {
      client.on("connect", () => {
        client.publish(
          `device/${_device.imeinumber}/cmd`,
          _payload,
          {
            qos: 1,
          },
          (err) => {
            client.end();
            err ? reject(err) : resolve();
          }
        );
      });
    });
    const command = await prisma.command.create({
      data: { ...commandData, response: "" },
      include: { device: true },
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

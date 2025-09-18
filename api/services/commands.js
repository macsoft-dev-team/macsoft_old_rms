const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const mqtt = require("mqtt");
const { createNotification } = require("./notification");

const getAllCommandsByDeviceId = async (skip, take, filter, deviceId) => {
  try {
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
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Fetch Commands Failed",
      operation: "fetch",
      message: `Error - ${error.message}`,
    });
    throw new Error("Could not fetch commands");
  }
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
    const notification = await createNotification({
      user: user,
      eventType: "crud",
      operation: "create",
      title: "New Command sent to Device",
      message: ` Command ${command.payload} sent to device ${_device.name} successfully.`,
    });
    const mqtt_server = `mqtt://${_device.host}:${_device.port}`;
    const creds = {
      username: _device.username,
      password: _device.password,
      clientId: _device.imeinumber,
    };
    const client = mqtt.connect(mqtt_server, creds);
    console.log(client);
    client.on("connect", () => {
      client.publish(
        `device/${_device.imeinumber}/cmd`,
        JSON.stringify(command)
      );
    });

    return command;
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Create Command Failed",
      operation: "create",
      message: `Error - ${error.message}`,
    });
    throw new Error("Could not create command");
  }
};

module.exports = {
  getAllCommandsByDeviceId,
  createCommand,
};

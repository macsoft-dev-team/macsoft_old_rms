const { PrismaClient } = require("@prisma/client");
const { response } = require("../app");
const prisma = new PrismaClient();

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
      data: { ...commandData, response: "..." },
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

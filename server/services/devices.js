const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getDevices = async (skip, take, filter) => {
  try {
    const params = {};
    if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take || 10);
    if (take) params.take = parseInt(take);
    if (filter) {
      params.where = {
        OR: [
          { imeinumber: { contains: filter } },
          { host: { contains: filter } },
          { username: { contains: filter } },
          { pubTopic: { contains: filter } },
          { subTopic: { contains: filter } },
        ],
      };
    }
    const count = await prisma.mqttCredentials.count({
      where: params.where || {},
    });
    const devices = await prisma.mqttCredentials.findMany(params);
    return { devices, count };
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDeviceByImei = async (imeinumber) => {
  try {
    const device = await prisma.mqttCredentials.findUnique({
      where: { imeinumber },
    });
    return device;
  } catch (error) {
    console.error("Error fetching device by IMEI:", error);
    throw new Error("Internal server error");
  }
};

module.exports = {
  getDevices,
  getDeviceByImei,
};

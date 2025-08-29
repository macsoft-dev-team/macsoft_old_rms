// Device Service
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      snamqttpubTopicData: true,
      snamqttsubTopicCmd: true,
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
      snamqttpubTopicData: true,
      snamqttsubTopicCmd: true,
    },
  });
};

const updateDevice = async (imeinumber, data) => {
  return prisma.device.update({ where: { imeinumber }, data });
};

module.exports = {
  getAllDevices,
  getDeviceById,
  updateDevice,
};

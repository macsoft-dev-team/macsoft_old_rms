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

    const count = await prisma.device.count({ where: params.where });
    const devices = await prisma.device.findMany(params);
    return { devices, count };
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw new Error("Could not fetch devices");
  }
};

const getDeviceById = async (id) => {
  return prisma.device.findUnique({ where: { id } });
};

const createDevice = async (data) => {
  return prisma.device.create({ data });
};

const updateDevice = async (id, data) => {
  return prisma.device.update({ where: { id }, data });
};

const deleteDevice = async (id) => {
  return prisma.device.delete({ where: { id } });
};

const getDeviceByImei = async (imeinumber) => {
  try {
    const device = await prisma.device.findUnique({
      where: { imeinumber },
      select: {
        imeinumber: true,
        macsoftmqtturl: true,
        macsoftmqttclientid: true,
        macsoftmqttusername: true,
        macsoftmqttpassword: true,
        macsoftmqttpubtopicdata: true,
        macsoftmqttsubtopiccmd: true,
        macsoftmqttpubtopiccmd: true,
      },
    });
    return device;
  } catch (error) {
    console.error("Error fetching device by IMEI:", error);
    throw new Error("Internal server error");
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceByImei,
};

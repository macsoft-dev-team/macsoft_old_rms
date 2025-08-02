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

    // Build where clause
    let where = {};
    if (filter) {
      where.AND = [
        filter.search && {
          OR: [
            { imeinumber: { contains: filter.search } },
            { username: { contains: filter.search } },
            { simnumber: { contains: filter.search } },
          ],
        },
        filter.status && { status: filter.status },
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

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};

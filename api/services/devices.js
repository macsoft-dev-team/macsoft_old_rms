// Device Service
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

const EMQX_API_URL = process.env.EMQX_API_URL || "http://localhost:18083/api/v5";
const EMQX_API_KEY = process.env.EMQX_API_KEY;
const EMQX_API_SECRET = process.env.EMQX_API_SECRET;

const emqxClient = axios.create({
  baseURL: EMQX_API_URL,
  auth: {
    username: EMQX_API_KEY,
    password: EMQX_API_SECRET,
  },
  timeout: 5000,
});

const fetchConnectedEmqxClientIds = async () => {
  if (!EMQX_API_KEY || !EMQX_API_SECRET) {
    return null;
  }

  try {
    const response = await emqxClient.get("/clients", {
      params: {
        fields: "clientid,username",
      },
    });
    const payload = response.data;
    const clients = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];

    return new Set(
      clients
        .map((client) => client.clientid || client.client_id || client.id)
        .filter(Boolean)
    );
  } catch (error) {
    console.error(
      "Error fetching EMQX clients:",
      error.response?.data || error.message
    );
    return null;
  }
};

const mapDeviceConnectionStatuses = (devices, connectedClientIds) => {
  if (!connectedClientIds) {
    return devices;
  }

  return devices.map((device) => ({
    ...device,
    status: connectedClientIds.has(device.macsoftmqttclientid) ? 1 : 0,
  }));
};

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

const getAllDevices = async (skip, take, filter, user) => {
  try {
    const { role, customerId } = user;

    const page = parseInt(skip) || 1;
    const limit = take ? parseInt(take) : undefined;
    const offset = (page - 1) * (limit || 0);
    const connectedClientIds = await fetchConnectedEmqxClientIds();
    const shouldApplyLiveStatusFilter = Boolean(filter?.status && connectedClientIds);

    const params = {};
    // Ensure skip is a non-negative integer
    if (!shouldApplyLiveStatusFilter && skip) params.skip = offset;
    if (!shouldApplyLiveStatusFilter && limit) params.take = limit;

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
        filter.status &&
          !shouldApplyLiveStatusFilter && { status: getStatus(filter.status) },
        filter.manufacturer && { customerId: filter.manufacturer || 0 },
      ].filter(Boolean);
    }

    // Restrict by customerId for non-admin users
    if (role !== "MACSOFT_ADMIN" && role !== "MACSOFT_USER") {
      where.customerId = customerId;
    }

    params.where = where;

    const count = shouldApplyLiveStatusFilter
      ? undefined
      : await prisma.device.count({ where: params.where });
    const devices = await prisma.device.findMany(params);
    let devicesWithConnectionStatus = mapDeviceConnectionStatuses(
      devices,
      connectedClientIds
    );

    if (shouldApplyLiveStatusFilter) {
      const status = getStatus(filter.status);
      devicesWithConnectionStatus = devicesWithConnectionStatus.filter(
        (device) => device.status === status
      );

      return {
        devices: limit
          ? devicesWithConnectionStatus.slice(offset, offset + limit)
          : devicesWithConnectionStatus,
        count: devicesWithConnectionStatus.length,
      };
    }

    return { devices: devicesWithConnectionStatus, count };
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

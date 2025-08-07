const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTodayDateRange = () => {
  const today = new Date();
  return {
    gte: new Date(today.setHours(0, 0, 0, 0)),
    lte: new Date(today.setHours(23, 59, 59, 999)),
  };
};

const getDeviceCounts = async (whereClause = {}) => {
  const [total, online, fault, offline] = await Promise.all([
    prisma.device.count({ where: whereClause }),
    prisma.device.count({ where: { ...whereClause, status: "ONLINE" } }),
    prisma.device.count({ where: { ...whereClause, status: "FAULT" } }),
    prisma.device.count({ where: { ...whereClause, status: "OFFLINE" } }),
  ]);

  return { total, online, fault, offline };
};

const getMacsoftDashboard = async () => {
  const deviceCounts = await getDeviceCounts();
  const [activeManufacturers, todaysComplaints, deviceLocations, recentActivity] =
    await Promise.all([
      prisma.customer.count(),
      prisma.notification.count({ where: { createdAt: getTodayDateRange() } }),
      prisma.device.findMany({
        select: { imeinumber: true, lattitude: true, longitude: true },
      }),
      prisma.command.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    ]);

  return {
    totalDevices: deviceCounts.total,
    onlineDevices: deviceCounts.online,
    faultDevices: deviceCounts.fault,
    offlineDevices: deviceCounts.offline,
    activeManufacturers,
    todaysComplaints,
    deviceLocations,
    recentActivity,
  };
};

const getCustomerDashboard = async (customerId) => {
  const whereClause = { customerId };
  const deviceCounts = await getDeviceCounts(whereClause);

  const [todaysComplaints, deviceLocations, recentActivity] = await Promise.all([
    prisma.notification.count({
      where: {
        user: { customerId },
        createdAt: getTodayDateRange(),
      },
    }),
    prisma.device.findMany({
      where: whereClause,
      select: { imeinumber: true, lattitude: true, longitude: true },
    }),
    prisma.command.findMany({
      where: { device: whereClause },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return {
    totalDevices: deviceCounts.total,
    onlineDevices: deviceCounts.online,
    faultDevices: deviceCounts.fault,
    offlineDevices: deviceCounts.offline,
    todaysComplaints,
    deviceLocations,
    recentActivity,
  };
};

const getDashboardData = async (user) => {
  const isMacsoftUser = user.role === "MACSOFT_ADMIN" || user.role === "MACSOFT_USER";
  const isCustomerUser = user.role === "CUSTOMER_ADMIN" || user.role === "CUSTOMER_USER";

  if (isMacsoftUser) {
    if (user.role !== "MACSOFT_ADMIN") {
      const err = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }
    return await getMacsoftDashboard();
  }

  if (isCustomerUser) {
    if (!user.customerId) {
      const err = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }
    return await getCustomerDashboard(user.customerId);
  }

  const err = new Error("Invalid user role");
  err.status = 403;
  throw err;
};

module.exports = {
  getDashboardData,
};

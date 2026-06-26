const { PrismaClient } = require("@prisma/client");
const commandService = require("./commands");

const prisma = new PrismaClient();

const isOnline = (device) => device.status === 1;
const toMillis = (value) => (value ? new Date(value).getTime() : Date.now());

const buildMotorStatus = (device) =>
  device.outputPower && device.outputPower > 0 ? "ON" : "OFF";

const buildLatestData = (device, mapping) => ({
  voltage: device.outputVoltage || 0,
  current: device.outputCurrent || 0,
  power: device.outputPower || 0,
  energy: device.cumulativeKWH || 0,
  frequency: device.frequency || 0,
  motorStatus: buildMotorStatus(device),
  lastUpdated: device.lastupdated ? new Date(device.lastupdated).toISOString() : null,
  vL1: device.outputVoltage || 0,
  vL2: device.outputVoltage || 0,
  vL3: device.outputVoltage || 0,
  iL1: device.outputCurrent || 0,
  iL2: device.outputCurrent || 0,
  iL3: device.outputCurrent || 0,
  motorVoltage: device.outputVoltage || 0,
  motorCurrent: device.outputCurrent || 0,
  motorFrequency: device.frequency || 0,
  energyToday: device.todayKWH || 0,
  energyTotal: device.cumulativeKWH || 0,
  runHoursToday: device.todayHours || 0,
  runHoursTotal: device.cumulativeHours || 0,
  waterOutputToday: device.todayFlow || 0,
  waterOutputTotal: device.cumulativeFlow || 0,
  friendlyName: mapping?.friendlyName || null,
});

const getUserMapping = async (userId, deviceId) =>
  prisma.userDeviceMapping.findFirst({
    where: { userId, deviceId, active: true },
    include: { device: true },
  });

const ensureDeviceAccess = async (userId, deviceId) => {
  const mapping = await getUserMapping(userId, deviceId);

  if (!mapping) {
    const error = new Error("Access denied");
    error.status = 403;
    throw error;
  }

  return mapping;
};

const registerDevice = async (userId, { imei, friendlyName }) => {
  if (!imei) {
    const error = new Error("IMEI is required");
    error.status = 400;
    throw error;
  }

  let device = await prisma.device.findUnique({
    where: { imeinumber: imei },
  });

  if (!device) {
    device = await prisma.device.create({
      data: {
        imeinumber: imei,
        status: 0,
      },
    });
  }

  await prisma.userDeviceMapping.updateMany({
    where: { deviceId: device.id, active: true },
    data: { active: false },
  });

  const mapping = await prisma.userDeviceMapping.create({
    data: {
      userId,
      deviceId: device.id,
      friendlyName: friendlyName || `Device ${device.serialNumber}`,
      active: true,
    },
  });

  return {
    deviceId: device.id,
    imei: device.imeinumber,
    friendlyName: mapping.friendlyName,
    status: isOnline(device) ? "ONLINE" : "OFFLINE",
    mappedAt: mapping.mappedAt,
  };
};

const getUserDevices = async (userId) => {
  const mappings = await prisma.userDeviceMapping.findMany({
    where: { userId, active: true },
    include: { device: true },
    orderBy: { mappedAt: "desc" },
  });

  return mappings.map((mapping) => ({
    deviceId: mapping.device.id,
    imei: mapping.device.imeinumber,
    friendlyName: mapping.friendlyName || `Device ${mapping.device.serialNumber}`,
    status: isOnline(mapping.device) ? "ONLINE" : "OFFLINE",
    signalStrength: mapping.device.signalStrength,
    lastSeen: mapping.device.lastupdated ? new Date(mapping.device.lastupdated).toISOString() : null,
    mappedAt: mapping.mappedAt.toISOString(),
    latestData: buildLatestData(mapping.device, mapping),
  }));
};

const getDeviceDetails = async (userId, deviceId) => {
  const mapping = await ensureDeviceAccess(userId, deviceId);
  const device = mapping.device;

  return {
    device_id: device.id,
    imei: device.imeinumber,
    friendly_name: mapping.friendlyName || `Device ${device.serialNumber}`,
    user_id: userId,
    is_online: isOnline(device),
    last_updated: toMillis(device.lastupdated),
    motor_status: buildMotorStatus(device),
    signal_strength: device.signalStrength || 0,
    voltage: device.outputVoltage || 0,
    current: device.outputCurrent || 0,
    frequency: device.frequency || 0,
    power: device.outputPower || 0,
    dc_current: device.inputCurrent || 0,
    dc_voltage: device.inputVoltage || 0,
    motor_current: device.outputCurrent || 0,
    motor_voltage: device.outputVoltage || 0,
    motor_frequency: device.frequency || 0,
    v_l1: device.outputVoltage || 0,
    v_l2: device.outputVoltage || 0,
    v_l3: device.outputVoltage || 0,
    i_l1: device.outputCurrent || 0,
    i_l2: device.outputCurrent || 0,
    i_l3: device.outputCurrent || 0,
    energy_today: device.todayKWH || 0,
    energy_total: device.cumulativeKWH || 0,
    run_hours_today: device.todayHours || 0,
    run_hours_total: device.cumulativeHours || 0,
    water_output_today: device.todayFlow || 0,
    water_output_total: device.cumulativeFlow || 0,
  };
};

const getDeviceStatistics = async (userId, deviceId, days = 7) => {
  const mapping = await ensureDeviceAccess(userId, deviceId);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days || 7));

  const history = await prisma.deviceHistory.findMany({
    where: {
      imeinumber: mapping.device.imeinumber,
      timestamp: {
        gte: startDate,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return history.map((record) => ({
    device_id: deviceId,
    timestamp: toMillis(record.timestamp),
    voltage: record.outputVoltage || 0,
    current: record.outputCurrent || 0,
    frequency: record.frequency || 0,
    power: record.outputPower || 0,
    energy: record.cumulativeKWH || 0,
    temperature: record.temperature || 0,
    waterOutput: record.flow || 0,
    v_l1: record.outputVoltage || 0,
    v_l2: record.outputVoltage || 0,
    v_l3: record.outputVoltage || 0,
    i_l1: record.outputCurrent || 0,
    i_l2: record.outputCurrent || 0,
    i_l3: record.outputCurrent || 0,
    motor_voltage: record.outputVoltage || 0,
    motor_current: record.outputCurrent || 0,
    motor_frequency: record.frequency || 0,
    run_hours: record.todayHours || 0,
  }));
};

const removeDeviceMapping = async (userId, deviceId) => {
  await ensureDeviceAccess(userId, deviceId);
  await prisma.userDeviceMapping.updateMany({
    where: { userId, deviceId, active: true },
    data: { active: false },
  });
};

const controlMotor = async (userId, { device_id: deviceId, command }) => {
  if (!deviceId || !command) {
    const error = new Error("device_id and command are required");
    error.status = 400;
    throw error;
  }

  const mapping = await ensureDeviceAccess(userId, deviceId);
  const normalized = command.toUpperCase();

  if (!["ON", "OFF"].includes(normalized)) {
    const error = new Error('command must be "ON" or "OFF"');
    error.status = 400;
    throw error;
  }

  await commandService.createCommand({
    deviceId: mapping.device.id,
    imeinumber: mapping.device.imeinumber,
    payload: normalized,
    type: "MOBILE_CONTROL",
  });

  return {
    message: `Motor ${normalized}`,
    motor_status: normalized,
  };
};

module.exports = {
  registerDevice,
  getUserDevices,
  getDeviceDetails,
  getDeviceStatistics,
  removeDeviceMapping,
  controlMotor,
};

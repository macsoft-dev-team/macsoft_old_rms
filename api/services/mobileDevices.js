const { PrismaClient } = require("@prisma/client");
const commandService = require("./commands");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const isOnline = (device) => device.status === 1;
const toMillis = (value) => (value ? new Date(value).getTime() : Date.now());

const buildMotorStatus = (device) =>
  device.status && device.status === 1 ? "ON" : "OFF";

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

// --- UPDATED: SECURE DEVICE ACCESS BY ROLE ---
const ensureDeviceAccess = async (user, deviceId) => {
  const { id: userId, role, customerId } = user;

  // 1. MACSOFT Admins bypass mapping checks completely
  if (role === "MACSOFT_ADMIN" || role === "MACSOFT_USER") {
    const device = await prisma.device.findUnique({ where: { id: deviceId } }); // ensure type matches DB (Int/String)
    if (!device) throw Object.assign(new Error("Device not found"), { status: 404 });
    return { device, friendlyName: device.friendlyName }; // Mock mapping shape
  }

  // 2. Customers bypass mapping checks, but must own the device
  if (role === "CUSTOMER_ADMIN" || role === "CUSTOMER_USER") {
    const device = await prisma.device.findUnique({ where: { id: deviceId } });
    if (!device || device.customerId !== customerId) {
      throw Object.assign(new Error("Access denied: Device belongs to another customer"), { status: 403 });
    }
    return { device, friendlyName: device.friendlyName };
  }

  // 3. End Users MUST have a record in UserDeviceMapping
  const mapping = await getUserMapping(userId, deviceId);
  if (!mapping) {
    const error = new Error("Access denied: Device not mapped to your account");
    error.status = 403;
    throw error;
  }

  return mapping;
};

// Validates a 15-digit IMEI using the Luhn algorithm
const isValidImei = (imei) => {
  const str = String(imei).trim();
  if (!/^\d{15}$/.test(str)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(str[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

// Helper to aggressively strip out bad IDs
const sanitizeId = (id) => {
  if (!id) return null;
  const strId = String(id).trim();
  if (strId === "" || strId === "ALL" || strId === "null" || strId === "undefined") return null;
  return strId;
};

const registerDevice = async (user, { imei, friendlyName, customerId }) => {
  if (!imei) {
    const error = new Error("IMEI is required");
    error.status = 400;
    throw error;
  }

  const imeinumberStr = String(imei).trim();

  // 1. Validate IMEI format
  if (!isValidImei(imeinumberStr)) {
    const error = new Error("Invalid IMEI number. Must be 15 digits and pass checksum.");
    error.status = 400;
    throw error;
  }

  // 2. Check if device exists
  let device = await prisma.device.findUnique({
    where: { imeinumber: imeinumberStr },
  });

  // 3. Aggressively sanitize all possible Customer IDs
  const inputCustId = sanitizeId(customerId);
  const userCustId = sanitizeId(user.customerId);
  const existingDeviceCustId = device ? sanitizeId(device.customerId) : null;

  // 4. Determine target Customer ID based on Role (Now Optional)
  let targetCustomerId = null;

  if (user.role === "MACSOFT_ADMIN" || user.role === "MACSOFT_USER") {
    targetCustomerId = inputCustId || existingDeviceCustId;
  } else if (user.role === "CUSTOMER_ADMIN" || user.role === "CUSTOMER_USER") {
    targetCustomerId = userCustId; // Will safely be null if they don't have an org
  } else {
    // End Users: Keep existing device owner, or use user's org, or default to null
    targetCustomerId = existingDeviceCustId || userCustId || null;
  }

  // 5. DATABASE VERIFICATION (Only runs if a Customer ID is actually provided)
  if (targetCustomerId) {
    const customerExists = await prisma.customer.findUnique({
      where: { id: targetCustomerId }
    });

    if (!customerExists) {
      const error = new Error(`Database Error: The assigned Customer ID (${targetCustomerId}) does not exist in the system. It may have been deleted.`);
      error.status = 400;
      throw error;
    }
  }

  // 6. Create or Update the base Device record
  if (!device) {
    const CATCH_COUNT = 1000;
    const PREFIX_TABLE_NAME = 'deviceLog_';
    const totalDevicesCount = await prisma.device.count();
    const tableName = PREFIX_TABLE_NAME + Math.ceil((totalDevicesCount + 1) / CATCH_COUNT);

    device = await prisma.device.create({
      data: {
        imeinumber: imeinumberStr,
        status: 0,
        customerId: targetCustomerId, // Safe to be null
        macsoftmqtturl: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
        macsoftmqttusername: `device_${imeinumberStr}`,
        macsoftmqttclientid: `device_${imeinumberStr}`,
        macsoftmqttpassword: bcrypt.hashSync(imeinumberStr, 10),
        macsoftmqttpubtopicdata: `device/${imeinumberStr}/data`,
        macsoftmqttsubtopiccmd: `device/${imeinumberStr}/cmd`,
        macsoftmqttpubtopiccmd: `device/${imeinumberStr}/cmd/response`,
        tablename: tableName,
      },
    });

  } else {
    if (user.role !== "END_USER") {
      device = await prisma.device.update({
        where: { id: device.id },
        data: {
          customerId: targetCustomerId,
        },
      });
    }
  }

  // 7. Handle End User Mapping
  let mapping = null;
  if (user.role === "END_USER") {
    await prisma.userDeviceMapping.updateMany({
      where: { deviceId: device.id, active: true },
      data: { active: false },
    });

    mapping = await prisma.userDeviceMapping.create({
      data: {
        userId: user.id,
        deviceId: device.id,
        friendlyName: friendlyName || `Device ${device.serialNumber || imeinumberStr}`,
        active: true,
      },
    });
  }

  // 8. Return standard response
  return {
    deviceId: device.id,
    imei: device.imeinumber,
    friendlyName: mapping ? mapping.friendlyName : `Device ${device.serialNumber}`,
    status: isOnline(device) ? "ONLINE" : "OFFLINE",
    customerId: device.customerId,
  };
};
const isToday = (timestamp) => {
  if (!timestamp) return false;

  const now = new Date();
  const ts = new Date(timestamp);

  return (
    now.getFullYear() === ts.getFullYear() &&
    now.getMonth() === ts.getMonth() &&
    now.getDate() === ts.getDate()
  );
};
// --- UPDATED: FETCH DEVICES BY ROLE ---
const getUserDevices = async (user) => {
  const { id: userId, role, customerId } = user;

  let mappedList = [];

  if (role === "MACSOFT_ADMIN" || role === "MACSOFT_USER") {
    // FETCH ALL DEVICES
    const devices = await prisma.device.findMany({ orderBy: { id: "desc" } });
    mappedList = devices.map(d => ({ device: d, friendlyName: d.friendlyName, mappedAt: null }));

  } else if (role === "CUSTOMER_ADMIN" || role === "CUSTOMER_USER") {
    // FETCH ONLY CUSTOMER DEVICES
    const devices = await prisma.device.findMany({
      where: { customerId: customerId },
      orderBy: { id: "desc" }
    });
    mappedList = devices.map(d => ({ device: d, friendlyName: d.friendlyName, mappedAt: null }));

  } else {
    // FETCH END_USER MAPPED DEVICES
    mappedList = await prisma.userDeviceMapping.findMany({
      where: { userId, active: true },
      include: { device: true },
      orderBy: { mappedAt: "desc" },
    });
  }

  // Uniform response mapping for Flutter
  return mappedList.map((mapping) => ({
    deviceId: mapping.device.id,
    imei: mapping.device.imeinumber,
    friendlyName: mapping.friendlyName || `Device ${mapping.device.serialNumber || mapping.device.imeinumber}`,
    status: isToday(mapping.device.timestamp) ? "ONLINE" : "OFFLINE",
    signalStrength: mapping.device.signalStrength || 0,
    lastSeen: mapping.device.lastupdated ? new Date(mapping.device.lastupdated).toISOString() : null,
    mappedAt: mapping.mappedAt ? mapping.mappedAt.toISOString() : null,
    latestData: buildLatestData(mapping.device, mapping),
  }));
};

const getDeviceDetails = async (user, deviceId) => {
  const mapping = await ensureDeviceAccess(user, deviceId);
  const device = mapping.device;

  return {
    device_id: device.id,
    imei: device.imeinumber,
    friendly_name: mapping.friendlyName || `Device ${device.serialNumber}`,
    user_id: user.id,
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

const getDeviceStatistics = async (user, deviceId) => {
  const mapping = await ensureDeviceAccess(user, deviceId);

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const history = await prisma.deviceLog_1.findMany({
    where: {
      imeinumber: mapping.device.imeinumber,
      timestamp: { gte: startDate },
    },
    orderBy: { timestamp: "asc" },
    select: {
      timestamp: true, outputVoltage: true, outputCurrent: true,
      frequency: true, outputPower: true, cumulativeKWH: true,
      temperature: true, flow: true, todayHours: true,
      cumulativeHours: true, 
    },
  });

  return history.map((record) => {
    const voltage = record.outputVoltage ?? 0;
    const current = record.outputCurrent ?? 0;

    return {
      device_id: deviceId,
      timestamp: toMillis(record.timestamp),
      voltage, current,
      frequency: record.frequency ?? 0,
      power: record.outputPower ?? 0,
      energy: record.cumulativeKWH ?? 0,
      temperature: record.temperature ?? 0,
      waterOutput: record.flow ?? 0,
      v_l1: voltage, v_l2: voltage, v_l3: voltage,
      i_l1: current, i_l2: current, i_l3: current,
      motor_voltage: voltage, motor_current: current, motor_frequency: record.frequency ?? 0,
      run_hours: record.cumulativeHours ?? 0,
    };
  });
};

const removeDeviceMapping = async (user, deviceId) => {
  await ensureDeviceAccess(user, deviceId);
  // Only END_USERS map devices like this. Do not let Admins run this.
  if (user.role === "END_USER") {
    await prisma.userDeviceMapping.updateMany({
      where: { userId: user.id, deviceId, active: true },
      data: { active: false },
    });
  }
};

const controlMotor = async (user, { device_id: deviceId, command }) => {
  if (!deviceId || !command) {
    const error = new Error("device_id and command are required");
    error.status = 400;
    throw error;
  }

  const mapping = await ensureDeviceAccess(user, deviceId);
  const normalized = command.toUpperCase();

  const commandMap = {
    ON: `{"SRUN:1";}`,
    OFF: `{"SRUN:0";}`,
  };

  if (!commandMap[normalized]) {
    const error = new Error('command must be "ON" or "OFF"');
    error.status = 400;
    throw error;
  }

  const payload = commandMap[normalized];

  await commandService.createCommand({
    deviceId: mapping.device.id,
    imeinumber: mapping.device.imeinumber,
    payload,
    type: "MOBILE_CONTROL",
  });

  return {
    message: `Motor ${normalized}`,
    motor_status: normalized,
  };
};

// --- FETCH ALL CUSTOMERS (MACSOFT ONLY) ---

const getAllCustomers = async (user) => {
  const { role } = user;

  // Only MACSOFT roles can see the master list of customers
  if (role !== "MACSOFT_ADMIN" && role !== "MACSOFT_USER") {
    const error = new Error("Access denied: You do not have permission to view all customers.");
    error.status = 403;
    throw error;
  }

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      // Include a count of how many users and devices belong to each customer
      _count: {
        select: { users: true, devices: true },
      },
    },
  });

  return customers;
};

// --- FETCH SINGLE CUSTOMER BY ID ---
const getCustomerById = async (user, requestedCustomerId) => {
  const { role, customerId: userCustomerId } = user;

  // Security Check: If they are a CUSTOMER role, they can only view their own ID
  if (
    role === "CUSTOMER_ADMIN" || role === "CUSTOMER_USER"
  ) {
    if (userCustomerId !== requestedCustomerId) {
      const error = new Error("Access denied: You can only view your own customer details.");
      error.status = 403;
      throw error;
    }
  } else if (role === "END_USER") {
    const error = new Error("Access denied: End users cannot view customer records.");
    error.status = 403;
    throw error;
  }

  const customer = await prisma.customer.findUnique({
    where: { id: requestedCustomerId },
    include: {
      _count: {
        select: { users: true, devices: true },
      },
    },
  });

  if (!customer) {
    const error = new Error("Customer not found.");
    error.status = 404;
    throw error;
  }

  return customer;
};

module.exports = {
  registerDevice,
  getUserDevices,
  getDeviceDetails,
  getDeviceStatistics,
  removeDeviceMapping,
  controlMotor,
  getAllCustomers,
  getCustomerById,
};
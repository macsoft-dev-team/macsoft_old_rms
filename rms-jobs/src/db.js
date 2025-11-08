const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

// Initialize Prisma client
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Setup logging for Prisma events
prisma.$on('error', (e) => {
  logger.error('Prisma error:', e);
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma warning:', e);
});

prisma.$on('info', (e) => {
  logger.info('Prisma info:', e);
});

prisma.$on('query', (e) => {
  logger.debug(`Query: ${e.query} Params: ${e.params} Duration: ${e.duration}ms`);
});

async function connect() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
    return true;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    return false;
  }
}

async function disconnect() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
  }
}

async function checkDeviceExists(deviceId) {
  try {
    const device = await prisma.device.findUnique({
      where: { imeinumber: deviceId },
      select: { 
        id: true, 
        imeinumber: true, 
        sna_synced_time: true 
      }
    });
    return device;
  } catch (error) {
    logger.error(`Error checking device ${deviceId}:`, error);
    return null;
  }
}

async function addToSnaQueue(deviceId) {
  try {
    const result = await prisma.device_sna_queue.upsert({
      where: { device_id: deviceId },
      update: {}, // No update needed if exists
      create: {
        device_id: deviceId,
        status: 'pending'
      }
    });
    logger.info(`Device ${deviceId} added to SNA queue`);
    return result;
  } catch (error) {
    logger.error(`Error adding device ${deviceId} to SNA queue:`, error);
    return null;
  }
}

async function getPendingSnaDevices() {
  try {
    const devices = await prisma.device_sna_queue.findMany({
      where: { status: 'pending' },
      orderBy: { created_at: 'asc' }
    });
    return devices;
  } catch (error) {
    logger.error('Error fetching pending SNA devices:', error);
    return [];
  }
}

async function updateSnaQueueStatus(deviceId, status) {
  try {
    const result = await prisma.device_sna_queue.update({
      where: { device_id: deviceId },
      data: { status: status }
    });
    logger.info(`Device ${deviceId} SNA queue status updated to ${status}`);
    return result;
  } catch (error) {
    logger.error(`Error updating SNA queue status for device ${deviceId}:`, error);
    return null;
  }
}

async function updateDeviceSnaSync(deviceId) {
  try {
    const result = await prisma.device.update({
      where: { imeinumber: deviceId },
      data: { sna_synced_time: new Date() }
    });
    logger.info(`Device ${deviceId} SNA sync time updated`);
    return result;
  } catch (error) {
    logger.error(`Error updating SNA sync time for device ${deviceId}:`, error);
    return null;
  }
}

function getClient() {
  return prisma;
}

module.exports = {
  connect,
  disconnect,
  checkDeviceExists,
  addToSnaQueue,
  getPendingSnaDevices,
  updateSnaQueueStatus,
  updateDeviceSnaSync,
  getClient
};
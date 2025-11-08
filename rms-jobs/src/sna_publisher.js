#!/usr/bin/env node

const mqtt = require('mqtt');
const config = require('./config');
const db = require('./db');
const logger = require('./utils/logger');

// Global state
let mqttClient = null;
let isRunning = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = config.jobs.reconnectAttempts;
const reconnectDelay = config.jobs.reconnectDelay;

async function start() {
  logger.info('Starting SNA Publisher single run...');
  
  try {
    // Connect to database first
    const dbConnected = await db.connect();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Setup MQTT connection
    await connectMqtt();

    // Process pending devices once
    await processPendingDevices();

    // Clean up and exit
    await cleanup();
    
    logger.info('SNA Publisher completed successfully');
    process.exit(0);
    
  } catch (error) {
    logger.error('SNA Publisher failed:', error);
    await cleanup();
    process.exit(1);
  }
}

async function connectMqtt() {
  return new Promise((resolve, reject) => {
    const mqttOptions = {
      clientId: `${config.mqtt.clientId}-publisher-${Date.now()}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: reconnectDelay,
      username: config.mqtt.username || undefined,
      password: config.mqtt.password || undefined
    };

    const mqttUrl = `mqtt://${config.mqtt.host}:${config.mqtt.port}`;
    logger.info(`Connecting to MQTT broker: ${mqttUrl}`);

    mqttClient = mqtt.connect(mqttUrl, mqttOptions);

    mqttClient.on('connect', () => {
      logger.info('Connected to MQTT broker');
      reconnectAttempts = 0;
      resolve();
    });

    mqttClient.on('error', (error) => {
      logger.error('MQTT connection error:', error);
      if (!mqttClient.connected) {
        reject(error);
      }
    });

    mqttClient.on('close', () => {
      logger.warn('MQTT connection closed');
    });

    mqttClient.on('disconnect', () => {
      logger.warn('MQTT disconnected');
    });

    mqttClient.on('offline', () => {
      logger.warn('MQTT client is offline');
    });
  });
}

async function cleanup() {
  if (mqttClient) {
    mqttClient.end(false);
    logger.info('MQTT client disconnected');
  }
  await db.disconnect();
  logger.info('Database disconnected');
}

async function processPendingDevices() {
  if (isRunning) {
    logger.debug('SNA publisher already running, skipping');
    return;
  }

  isRunning = true;
  logger.debug('Processing pending SNA devices...');

  try {
    const pendingDevices = await db.getPendingSnaDevices();
    
    if (pendingDevices.length === 0) {
      logger.info('No pending devices found');
      return;
    }

    logger.info(`Found ${pendingDevices.length} pending devices for SNA sync`);

    for (const device of pendingDevices) {
      try {
        await publishSnaCredentials(device.device_id);
        await delay(100); // Small delay between publishes
      } catch (error) {
        logger.error(`Failed to process device ${device.device_id}:`, error);
      }
    }

  } catch (error) {
    logger.error('Error processing pending devices:', error);
  } finally {
    isRunning = false;
  }
}

async function publishSnaCredentials(deviceId) {
  try {
    if (!mqttClient || !mqttClient.connected) {
      logger.warn('MQTT client not connected, skipping publish for device:', deviceId);
      return;
    }

    const topic = `${config.mqtt.deviceCommandTopicPrefix}${deviceId}${config.mqtt.deviceCommandTopicSuffix}`;
    
    const payload = {
      sna_host: config.sna.host,
      sna_username: config.sna.username,
      sna_password: config.sna.password,
      info_topic: `${config.sna.infoTopicPrefix}${deviceId}${config.sna.topicSuffixes.info}`,
      data_topic: `${config.sna.dataTopicPrefix}${deviceId}${config.sna.topicSuffixes.data}`,
      heartbeat_topic: `${config.sna.heartbeatTopicPrefix}${deviceId}${config.sna.topicSuffixes.heartbeat}`
    };

    logger.info(`Publishing SNA credentials to device ${deviceId} on topic: ${topic}`);
    logger.debug(`Payload:`, payload);

    await publishWithRetry(topic, JSON.stringify(payload), deviceId);
    
  } catch (error) {
    logger.error(`Error publishing SNA credentials for device ${deviceId}:`, error);
    throw error;
  }
}

async function publishWithRetry(topic, payload, deviceId, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        mqttClient.publish(topic, payload, { qos: 1 }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      // Successful publish, update status
      await db.updateSnaQueueStatus(deviceId, 'sent');
      await db.updateDeviceSnaSync(deviceId);
      
      logger.info(`Successfully published SNA credentials for device ${deviceId}`);
      return;

    } catch (error) {
      logger.warn(`Publish attempt ${attempt}/${maxRetries} failed for device ${deviceId}:`, error);
      
      if (attempt === maxRetries) {
        logger.error(`All publish attempts failed for device ${deviceId}`);
        throw error;
      }
      
      // Wait before retry
      await delay(1000 * attempt);
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the publisher if this file is run directly
if (require.main === module) {
  start().catch((error) => {
    logger.error('Failed to start SNA Publisher:', error);
    process.exit(1);
  });
}
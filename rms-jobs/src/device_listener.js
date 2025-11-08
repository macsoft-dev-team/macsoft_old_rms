#!/usr/bin/env node

const mqtt = require('mqtt');
const config = require('./config');
const db = require('./db');
const logger = require('./utils/logger');

// Global state
let mqttClient = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = config.jobs.reconnectAttempts;
const reconnectDelay = config.jobs.reconnectDelay;
let isShuttingDown = false;

async function start() {
  logger.info('Starting Device Connect Listener...');
  
  // Connect to database first
  const dbConnected = await db.connect();
  if (!dbConnected) {
    logger.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  // Setup MQTT connection
  connectMqtt();

  // Setup graceful shutdown
  setupGracefulShutdown();
}

function connectMqtt() {
  const mqttOptions = {
    clientId: `${config.mqtt.clientId}-listener-${Date.now()}`,
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
    
    // Subscribe to device connection events
    const topic = config.mqtt.connectionEventTopic;
    mqttClient.subscribe(topic, (err) => {
      if (err) {
        logger.error(`Failed to subscribe to topic ${topic}:`, err);
      } else {
        logger.info(`Subscribed to topic: ${topic}`);
      }
    });
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      await handleConnectionEvent(topic, message.toString());
    } catch (error) {
      logger.error('Error handling connection event:', error);
    }
  });

  mqttClient.on('error', (error) => {
    logger.error('MQTT connection error:', error);
  });

  mqttClient.on('close', () => {
    logger.warn('MQTT connection closed');
    if (!isShuttingDown) {
      handleReconnect();
    }
  });

  mqttClient.on('disconnect', () => {
    logger.warn('MQTT disconnected');
  });

  mqttClient.on('offline', () => {
    logger.warn('MQTT client is offline');
  });
}

async function handleConnectionEvent(topic, message) {
  logger.debug(`Received connection event on topic: ${topic}, message: ${message}`);
  
  // Extract device ID from topic
  // Topic format: $SYS/brokers/{node}/clients/{clientid}/connected
  const topicParts = topic.split('/');
  if (topicParts.length >= 5 && topicParts[4] === 'connected') {
    const deviceId = topicParts[3]; // Client ID is the device ID
    
    if (!deviceId || deviceId === 'undefined') {
      logger.debug('Ignoring connection event with invalid device ID');
      return;
    }

    logger.info(`Device connected: ${deviceId}`);
    await processDeviceConnection(deviceId);
  }
}

async function processDeviceConnection(deviceId) {
  try {
    // Check if device exists and if it's already synced
    const device = await db.checkDeviceExists(deviceId);
    
    if (!device) {
      logger.debug(`Device ${deviceId} not found in database, ignoring`);
      return;
    }

    if (device.sna_synced_time) {
      logger.debug(`Device ${deviceId} already synced at ${device.sna_synced_time}, ignoring`);
      return;
    }

    // Device exists but not synced, add to queue
    logger.info(`Device ${deviceId} needs SNA sync, adding to queue`);
    await db.addToSnaQueue(deviceId);
    
  } catch (error) {
    logger.error(`Error processing device connection for ${deviceId}:`, error);
  }
}

function handleReconnect() {
  if (reconnectAttempts >= maxReconnectAttempts) {
    logger.error(`Max reconnection attempts (${maxReconnectAttempts}) reached. Exiting...`);
    process.exit(1);
  }

  reconnectAttempts++;
  logger.info(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts}) in ${reconnectDelay}ms`);
  
  setTimeout(() => {
    if (!isShuttingDown) {
      connectMqtt();
    }
  }, reconnectDelay);
}

function setupGracefulShutdown() {
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    isShuttingDown = true;

    if (mqttClient) {
      mqttClient.end(false, {}, () => {
        logger.info('MQTT client disconnected');
      });
    }

    await db.disconnect();
    logger.info('Device Connect Listener stopped');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
}

// Start the listener if this file is run directly
if (require.main === module) {
  start().catch((error) => {
    logger.error('Failed to start Device Connect Listener:', error);
    process.exit(1);
  });
}
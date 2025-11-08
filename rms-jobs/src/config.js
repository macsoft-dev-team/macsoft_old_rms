require('dotenv').config();

const config = {
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'mysql://root:Welcome123!@localhost:3306/rms'
  },

  // MQTT configuration for EMQX broker
  mqtt: {
    host: process.env.MQTT_HOST || 'localhost',
    port: parseInt(process.env.MQTT_PORT) || 1883,
    username: process.env.MQTT_USERNAME || '',
    password: process.env.MQTT_PASSWORD || '',
    clientId: process.env.MQTT_CLIENT_ID || 'rms-sna-sync',
    // Topics
    connectionEventTopic: '$SYS/brokers/+/clients/+/connected',
    deviceCommandTopicPrefix: 'device/',
    deviceCommandTopicSuffix: '/cmd'
  },

  // SNA MQTT configuration
  sna: {
    host: process.env.SNA_HOST || 'mqtt.sna.gov.in',
    username: process.env.SNA_USERNAME || '',
    password: process.env.SNA_PASSWORD || '',
    infoTopicPrefix: 'sna/',
    dataTopicPrefix: 'sna/',
    heartbeatTopicPrefix: 'sna/',
    topicSuffixes: {
      info: '/info',
      data: '/data',
      heartbeat: '/heartbeat'
    }
  },

  // Job configuration
  jobs: {
    reconnectAttempts: parseInt(process.env.MQTT_RECONNECT_ATTEMPTS) || 5,
    reconnectDelay: parseInt(process.env.MQTT_RECONNECT_DELAY) || 5000 // milliseconds
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;
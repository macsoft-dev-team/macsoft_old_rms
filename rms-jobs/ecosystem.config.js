module.exports = {
  apps: [
    {
      "name": 'rms-device-listener',
      "script": 'src/device_listener.js',
      "cwd": '/root/macsoft-rms/rms-jobs',
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": '512M',
      "env": {
        "NODE_ENV": 'production',
        "DATABASE_URL": "mysql://root:Welcome123!@localhost:3306/rms",
        "PORT": 4003,
        "JWT_SECRET_KEY": "mqtt-secret",
        "MQTT_HOST": "mqtt://mqtt.macsoftautomations.in",
        "MQTT_PORT": 1883,
        "MQTT_USERNAME": "admin",
        "MQTT_PASSWORD": "admin",
        "MQTT_CLIENT_ID": "rms-device-listener",
        "LOG_LEVEL": 'info'
      },
      "env_development": {
        "NODE_ENV": 'development',
        "DATABASE_URL": "mysql://root:Welcome123!@localhost:3306/rms",
        "PORT": 4003,
        "JWT_SECRET_KEY": "mqtt-secret",
        "MQTT_HOST": "localhost",
        "MQTT_PORT": 1883,
        "MQTT_USERNAME": "admin",
        "MQTT_PASSWORD": "admin",
        "MQTT_CLIENT_ID": "rms-device-listener",
        "LOG_LEVEL": 'debug'
      },
      "error_file": './logs/device-listener-error.log',
      "out_file": './logs/device-listener-out.log',
      "log_file": './logs/device-listener-combined.log',
      "time": true
    }
  ]
};
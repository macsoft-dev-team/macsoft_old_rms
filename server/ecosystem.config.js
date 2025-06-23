module.exports = {
  apps : [
    {
      name: 'main-app',
      script: 'index.js',
      watch: '.',
      env: {
        NODE_ENV: 'development',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        PORT:3000,
        JWT_SECRET_KEY:"mqtt-secret",
        MQTT_HOST:"localhost",
        MQTT_PORT:1883
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        PORT:3000,
        JWT_SECRET_KEY:"mqtt-secret",
        MQTT_HOST:"mqtt.macsoftautomations.in",
        MQTT_PORT:1883
      }
    }
  ]
};

  
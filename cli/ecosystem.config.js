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
        HTTP_SERVER:"http://localhost:3000",
        IMEINUMBER:"9962264503",
        MQTT_HOST: "mqtt://localhost",
        MQTT_PORT: 1883,        
        MQTT_USERNAME:"admin",
        MQTT_PASSWORD:"admin"
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        PORT:3000,
        JWT_SECRET_KEY:"mqtt-secret",
        HTTP_SERVER:"https://rms.macsoftautomations.in",
        IMEINUMBER:"9962264503",
        MQTT_HOST: "mqtt://mqtt.macsoftautomations.in",
        MQTT_PORT: 1883,        
        MQTT_USERNAME:"admin",
        MQTT_PASSWORD:"admin"
      }
    },
    {
      name: 'simulate-device',
      script: 'simulate-device.js',
      watch: false,
      env: {
        NODE_ENV: 'development',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        PORT:3000,
        JWT_SECRET_KEY:"mqtt-secret",
        HTTP_SERVER:"http://localhost:3000",
        IMEINUMBER:"9962264503",
        MQTT_USERNAME:"admin",
        MQTT_PASSWORD:"admin",
        CRON_EXPRESSION: '0 */1 * * * *'
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        PORT:3000,
        JWT_SECRET_KEY:"mqtt-secret",
        HTTP_SERVER:"https://rms.macsoftautomations.in",
        IMEINUMBER:"9962264503",
        MQTT_USERNAME:"admin",
        MQTT_PASSWORD:"admin",
        CRON_EXPRESSION: '0 */1 * * * *'
      }
    }
  ]
};

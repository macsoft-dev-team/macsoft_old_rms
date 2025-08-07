module.exports = {
  apps : [
    {
      name: 'Macsoft RMS Background Service',
      script: 'index.js',
      watch: '.',
      env: {
        NODE_ENV: 'development',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        RMS_HTTP_SERVER:"http://localhost:3000",
        RMS_IMEINUMBER:"9962264503",
        RMS_MQTT_HOST: "mqtt://localhost",
        RMS_MQTT_PORT: 1883,        
        RMS_MQTT_USERNAME:"admin",
        RMS_MQTT_PASSWORD:"admin"
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        RMS_HTTP_SERVER:"https://rms.macsoftautomations.in",
        RMS_IMEINUMBER:"862287076795236",
        RMS_MQTT_HOST: "mqtt://mqtt.macsoftautomations.in",
        RMS_MQTT_PORT: 1883,        
        RMS_MQTT_USERNAME:"admin",
        RMS_MQTT_PASSWORD:"admin"
      }
    },
    {
      name: 'Macsoft RMS Device Simulator',
      script: 'simulate-device.js',
      watch: false,
      env: {
        NODE_ENV: 'development',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        RMS_HTTP_SERVER:"http://localhost:3000",
        RMS_IMEINUMBER:"9962264503",
        RMS_MQTT_USERNAME:"admin",
        RMS_MQTT_PASSWORD:"admin",
        RMS_CRON_EXPRESSION: "0 */1 * * * *"
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        RMS_HTTP_SERVER:"https://rms.macsoftautomations.in",
        RMS_IMEINUMBER:"862287076795236",
        RMS_MQTT_USERNAME:"admin",
        RMS_MQTT_PASSWORD:"admin",
        RMS_CRON_EXPRESSION: "0 */1 * * * *"
      }
    }
  ]
};

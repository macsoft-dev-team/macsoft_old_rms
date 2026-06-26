module.exports = {
  apps : [
    {
      name: 'Macsoft RMS API',
      script: './bin/www',
      watch: '.',
      env: {
        NODE_ENV: 'development',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        PORT:3000,
        JWT_SECRET_KEY:"mqtt-secret",
        MQTT_HOST:"localhost",
        MQTT_PORT:1883,
	EMQX_API_URL: "http://localhost:18083/api/v5",
	EMQX_API_KEY: "f4c2f4fee7ca3f87",
	EMQX_API_SECRET: "SCImYWRN6aK3LhgVF2IiPByFJeOohBWw80iKmmz9CMWE"
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL:"mysql://root:Welcome123!@localhost:3306/rms",
        PORT:4003,
        JWT_SECRET_KEY:"mqtt-secret",
        MQTT_HOST:"mqtt.macsoftautomations.in",
        MQTT_PORT:1883,
	EMQX_API_URL: "http://localhost:18083/api/v5",
	EMQX_API_KEY: "f4c2f4fee7ca3f87",
	EMQX_API_SECRET: "SCImYWRN6aK3LhgVF2IiPByFJeOohBWw80iKmmz9CMWE"
      }
    }
  ]
};

  

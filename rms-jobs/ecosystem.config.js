module.exports = {
  apps: [
    {
      name: 'rms-device-listener',
      script: 'src/device_listener.js',
      cwd: '/home/raja/workspace/macsoft-rms/rms-jobs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info'
      },
      env_development: {
        NODE_ENV: 'development',
        LOG_LEVEL: 'debug'
      },
      error_file: './logs/device-listener-error.log',
      out_file: './logs/device-listener-out.log',
      log_file: './logs/device-listener-combined.log',
      time: true
    }
  ]
};
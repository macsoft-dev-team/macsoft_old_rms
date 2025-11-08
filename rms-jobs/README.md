# RMS Background Jobs

This module contains background jobs for the RMS (Remote Monitoring System) to manage SNA MQTT credential synchronization when devices connect to the EMQX broker.

## Overview

The system consists of two Node.js CLI background jobs:

1. **Device Connect Listener** (`device_listener.js`) - Runs continuously, listens for EMQX connection events and queues unsynced devices
2. **SNA Publisher** (`sna_publisher.js`) - Single-run script that publishes SNA MQTT credentials to queued devices (designed for crontab scheduling)

## Architecture

```
EMQX Broker → Device Connect Listener → Database (device_sna_queue)
                                              ↓
Device Command Topic ← SNA Publisher (Cron) ← Database (device_sna_queue)
```

## Database Schema

### New Table: `device_sna_queue`
```sql
CREATE TABLE device_sna_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(50) NOT NULL,
  status ENUM('pending','sent') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY (device_id)
);
```

### Updated Device Table
- Added `sna_synced_time DateTime?` field to track sync status

## Setup Instructions

### 1. Install Dependencies

```bash
cd rms-jobs
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update `.env` with your specific configuration:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@host:port/database"

# MQTT Broker Configuration (EMQX)
MQTT_HOST="localhost"
MQTT_PORT=1883
MQTT_USERNAME="admin_username"
MQTT_PASSWORD="admin_password"

# SNA MQTT Configuration
SNA_HOST="mqtt.sna.gov.in"
SNA_USERNAME="sna_username"
SNA_PASSWORD="sna_password"
```

### 3. Database Migration

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Running the Jobs

### Development

Start the device listener and test the publisher:

```bash
# Terminal 1 - Device Connect Listener (runs continuously)
npm run start:listener

# Terminal 2 - Test SNA Publisher (single run)
npm run run:publisher
```

### Production Deployment

#### Option 1: PM2 for Device Listener + Crontab for Publisher

Start Device Listener with PM2:

```bash
# Start only the device listener with PM2
pm2 start ecosystem.config.js --only rms-device-listener
pm2 save
pm2 startup
```

Setup crontab for SNA Publisher:

```bash
# Edit crontab
crontab -e

# Add this line to run every minute (adjust as needed)
* * * * * cd /path/to/rms-jobs && /usr/bin/node src/sna_publisher.js >> /var/log/rms-sna-publisher.log 2>&1
```

See `crontab.example` for more scheduling options.

#### Option 2: PM2 for Both Jobs

Update `ecosystem.config.js` to use cron mode for the publisher:

```javascript
{
  name: 'rms-sna-publisher',
  script: 'src/sna_publisher.js',
  cron_restart: '* * * * *', // Every minute
  autorestart: false,
  watch: false
}
```

## Job Details

### Job A: Device Connect Listener

**Purpose**: Listen for EMQX connection events and queue unsynced devices.

**Behavior**:
- Connects to EMQX broker as admin client
- Subscribes to `$SYS/brokers/+/clients/+/connected`
- Extracts device ID from connection events
- Checks device existence and sync status in database
- Adds unsynced devices to `device_sna_queue`

**MQTT Topics**:
- Subscribe: `$SYS/brokers/+/clients/+/connected`

### Job B: SNA Publisher

**Purpose**: Single-run script that publishes SNA MQTT credentials to devices awaiting configuration.

**Behavior**:
- Connects to database and MQTT broker
- Fetches all pending devices from `device_sna_queue`
- Publishes SNA credentials to each device
- Updates queue status and device sync time on success
- Exits after processing (designed for crontab scheduling)

**Scheduling**: Designed to be run via Linux crontab (e.g., every minute)

**MQTT Topics**:
- Publish: `device/{deviceid}/cmd`

**Payload Format**:
```json
{
  "sna_host": "mqtt.sna.gov.in",
  "sna_username": "<username>",
  "sna_password": "<password>",
  "info_topic": "sna/{deviceid}/info",
  "data_topic": "sna/{deviceid}/data",
  "heartbeat_topic": "sna/{deviceid}/heartbeat"
}
```

## Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | Required |
| `MQTT_HOST` | EMQX broker hostname | localhost |
| `MQTT_PORT` | EMQX broker port | 1883 |
| `MQTT_USERNAME` | EMQX admin username | "" |
| `MQTT_PASSWORD` | EMQX admin password | "" |
| `MQTT_CLIENT_ID` | Base client ID for jobs | rms-sna-sync |
| `MQTT_RECONNECT_ATTEMPTS` | Max reconnection attempts | 5 |
| `MQTT_RECONNECT_DELAY` | Reconnection delay (ms) | 5000 |
| `SNA_HOST` | SNA MQTT broker | mqtt.sna.gov.in |
| `SNA_USERNAME` | SNA MQTT username | Required |
| `SNA_PASSWORD` | SNA MQTT password | Required |
| `LOG_LEVEL` | Logging level | info |

### Crontab Scheduling

The SNA Publisher is designed to run as a cron job. Example schedules:

```bash
# Every minute
* * * * * cd /path/to/rms-jobs && node src/sna_publisher.js

# Every 5 minutes  
*/5 * * * * cd /path/to/rms-jobs && node src/sna_publisher.js

# Every 30 seconds (two entries)
* * * * * cd /path/to/rms-jobs && node src/sna_publisher.js
* * * * * sleep 30 && cd /path/to/rms-jobs && node src/sna_publisher.js
```

### Logging Levels

- `error`: Error messages only
- `warn`: Warnings and errors
- `info`: General information (recommended)
- `debug`: Detailed debugging information

## Monitoring

### Logs

Both jobs provide structured logging with timestamps:

```
[2024-11-06T10:30:00.000Z] [INFO] Starting Device Connect Listener...
[2024-11-06T10:30:01.000Z] [INFO] Connected to MQTT broker
[2024-11-06T10:30:02.000Z] [INFO] Subscribed to topic: $SYS/brokers/+/clients/+/connected
```

### Health Checks

Monitor job health by checking:
- MQTT connection status
- Database connectivity
- Processing queue sizes
- Error rates in logs

### Database Queries

Check queue status:
```sql
SELECT status, COUNT(*) as count 
FROM device_sna_queue 
GROUP BY status;
```

Check recent syncs:
```sql
SELECT imeinumber, sna_synced_time 
FROM device 
WHERE sna_synced_time IS NOT NULL 
ORDER BY sna_synced_time DESC 
LIMIT 10;
```

## Troubleshooting

### Common Issues

1. **MQTT Connection Failed**
   - Verify MQTT_HOST, MQTT_PORT, credentials
   - Check network connectivity to EMQX broker
   - Ensure EMQX allows admin connections

2. **Database Connection Failed**
   - Verify DATABASE_URL format
   - Check MySQL server status
   - Ensure database and tables exist

3. **No Devices Being Queued**
   - Verify devices are connecting to EMQX
   - Check if devices already have sna_synced_time set
   - Verify device records exist in database

4. **SNA Publishing Fails**
   - Check SNA credentials and broker connectivity
   - Verify device command topics are correct
   - Ensure devices are listening on command topics

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm run start:listener
```

## Security Considerations

- Store sensitive credentials in environment variables
- Use dedicated MQTT admin accounts with minimal permissions
- Implement proper access controls for SNA credentials
- Monitor for unauthorized access attempts
- Regularly rotate MQTT passwords

## Contributing

1. Follow existing code structure and naming conventions
2. Add proper error handling and logging
3. Update documentation for any configuration changes
4. Test with both development and production environments

## License

[License information here]
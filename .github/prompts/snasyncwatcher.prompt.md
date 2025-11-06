---
mode: agent
---
Create two Node.js CLI background jobs for the RMS system to manage SNA MQTT credential synchronization when devices connect to the EMQX broker.

# Context
- RMS web and EMQX share the same MySQL database.
- Devices connect to mqtt.macsoftautomations.in.
- Each device has a unique ID (IMEI or device_id).
- EMQX publishes connection events via `$SYS/brokers/+/clients/+/connected`.
- There is already an existing `device` table that includes sync status and identifiers.
- This feature will introduce a new table `device_sna_queue`.

# Goal
Implement two CLI jobs:
1. **Device Connect Listener**
2. **SNA Publisher**

---

## 1. Device Connect Listener (Job A)

### Purpose
Listen for EMQX connection events and log unsynced devices to a queue table for later processing.

### Behavior
- Connect to EMQX as an MQTT admin using the `mqtt` npm package.
- Subscribe to topic:
```

$SYS/brokers/+/clients/+/connected

````
- When a message arrives:
- Extract the connected device ID.
- Query the `device` table to check if the device exists and whether it is already synced (`sna_synced_time` IS NOT NULL).
- If not synced, insert a record into `device_sna_queue` if not already present.

### Table Schema
Create a new table `device_sna_queue`:
```sql
CREATE TABLE device_sna_queue (
id INT AUTO_INCREMENT PRIMARY KEY,
device_id VARCHAR(50) NOT NULL,
status ENUM('pending','sent') DEFAULT 'pending',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY (device_id)
);
````

### Notes

* Use Prisma for DB operations. Prisma already installed and schema is available in rms-jobs folder. create schema for new table accordingly.
* Use `dotenv` for configuration.
* Include basic logging (console).
* Handle reconnects gracefully.

---

## 2. SNA Publisher (Job B)

### Purpose

Scan the queue table and publish SNA MQTT credentials to devices awaiting configuration.

### Behavior

* Scheduled using cron every 60 seconds.
* Fetch all rows from `device_sna_queue` where `status = 'pending'`.
* For each pending record:

  * Publish to topic:

    ```
    device/:deviceid/cmd
    ```

    with payload:

    ```json
    {
      "sna_host": "mqtt.sna.gov.in",
      "sna_username": "<username>",
      "sna_password": "<password>",
      "info_topic": "sna/:deviceid/info",
      "data_topic": "sna/:deviceid/data",
      "heartbeat_topic": "sna/:deviceid/heartbeat"
    }
    ```
  * On successful publish, update the record’s `sna_sync_cmd_status` to `sent`.

### Notes

* Use same MQTT admin credentials as Job A.
* Handle publish failures and retries.
* Include logging for each publish attempt and status update.

---

## Project Structure Example

```
rms-jobs/
 ├── src/
 │    ├── config.js               # dotenv config
 │    ├── db.js                   # mysql2 or Prisma client
 │    ├── jobA_device_listener.js # listens to EMQX connect events
 │    ├── jobB_sna_publisher.js   # publishes SNA MQTT credentials
 │    └── utils/logger.js
 ├── package.json
 ├── .env
 └── README.md
```

## Expected Output

* Fully working Node.js scripts for both jobs.
* Ready-to-run CLI tools with proper database schema, MQTT handling, and error logging.
* Jobs A to be deployed as PM2 services.


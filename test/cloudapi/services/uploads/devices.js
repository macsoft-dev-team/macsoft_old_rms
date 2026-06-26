const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { exec } = require("child_process");
const prisma = new PrismaClient();

const uploadDevice = async (devicesFromXL, batchSize = 100) => {
  try {
    const CATCH_COUNT = 1000;
    const PREFIX_TABLE_NAME = 'deviceLog_';

    // ── Step 1: Filter rows missing imeinumber ────────────────────────────
    const validDevices = devicesFromXL.filter(
      (device) => device.imeinumber && String(device.imeinumber).trim() !== ''
    );

    if (validDevices.length === 0) {
      throw new Error('No valid devices found with imeinumber');
    }

    // ── Step 2: Detect within-file duplicates ─────────────────────────────
    const seenImeis = new Set();
    const withinFileDuplicates = [];
    const uniqueFromFile = [];

    validDevices.forEach((device) => {
      const imei = String(device.imeinumber).trim();
      if (seenImeis.has(imei)) {
        withinFileDuplicates.push({ imeinumber: imei, reason: 'Duplicate within upload file' });
      } else {
        seenImeis.add(imei);
        uniqueFromFile.push(device);
      }
    });

    // ── Step 3: Detect IMEIs already in the database ──────────────────────
    const allImeis = uniqueFromFile.map((d) => String(d.imeinumber).trim());
    const existingRecords = await prisma.device.findMany({
      where: { imeinumber: { in: allImeis } },
      select: { imeinumber: true },
    });
    const existingImeiSet = new Set(existingRecords.map((r) => r.imeinumber));

    const dbDuplicates = [];
    const newDevices = [];

    uniqueFromFile.forEach((device) => {
      const imei = String(device.imeinumber).trim();
      if (existingImeiSet.has(imei)) {
        dbDuplicates.push({ imeinumber: imei, reason: 'Already exists in database' });
      } else {
        newDevices.push(device);
      }
    });

    const preCheckFailed = [...withinFileDuplicates, ...dbDuplicates];

    if (newDevices.length === 0) {
      return {
        totalProcessed: validDevices.length,
        totalCreated: 0,
        totalSkipped: validDevices.length,
        failed: preCheckFailed,
        batchResults: [],
        summary: {
          message: `No new devices to insert. All ${validDevices.length} device(s) are duplicates.`,
          totalBatches: 0,
          batchSize,
        },
      };
    }

    // ── Step 4: Transform new devices ─────────────────────────────────────
    const totalDevicesCount = await prisma.device.count();

    const devicesTransformed = newDevices.map((device, index) => {
      const imeinumberStr = String(device.imeinumber).trim();
      const tableName =
        PREFIX_TABLE_NAME + Math.ceil((totalDevicesCount + index + 1) / CATCH_COUNT);
      return {
        macsoftmqtturl: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
        macsoftmqttusername: `device_${imeinumberStr}`,
        macsoftmqttclientid: `device_${imeinumberStr}`,
        macsoftmqttpassword: bcrypt.hashSync(imeinumberStr, 10),
        macsoftmqttpubtopicdata: `device/${imeinumberStr}/data`,
        macsoftmqttsubtopiccmd: `device/${imeinumberStr}/cmd`,
        macsoftmqttpubtopiccmd: `device/${imeinumberStr}/cmd/response`,
        imeinumber: imeinumberStr,
        tablename: tableName,
      };
    });

    // ── Step 5: Insert in batches ─────────────────────────────────────────
    const totalBatches = Math.ceil(devicesTransformed.length / batchSize);
    let totalCreated = 0;
    const batchResults = [];
    const batchFailed = [];

    for (let i = 0; i < totalBatches; i++) {
      const batch = devicesTransformed.slice(i * batchSize, (i + 1) * batchSize);
      console.log(`Processing batch ${i + 1}/${totalBatches} (${batch.length} devices)`);

      try {
        const batchResult = await prisma.device.createMany({ data: batch, skipDuplicates: true });
        totalCreated += batchResult.count;
        batchResults.push({
          batchNumber: i + 1,
          processed: batch.length,
          created: batchResult.count,
          skipped: batch.length - batchResult.count,
        });
        console.log(`Batch ${i + 1}: ${batchResult.count} created, ${batch.length - batchResult.count} skipped`);
      } catch (batchError) {
        console.error(`Error in batch ${i + 1}:`, batchError);
        batch.forEach((device) =>
          batchFailed.push({ imeinumber: device.imeinumber, reason: `DB insert error: ${batchError.message}` })
        );
        batchResults.push({ batchNumber: i + 1, processed: batch.length, created: 0, error: batchError.message });
      }

      if (i < totalBatches - 1) await new Promise((r) => setTimeout(r, 50));
    }

    const allFailed = [...preCheckFailed, ...batchFailed];
    console.log(
      `Upload complete: ${totalCreated} created, ${allFailed.length} failed out of ${validDevices.length} total`
    );

    if (totalCreated > 0) {
      const serviceIds = [17, 10];  
      serviceIds.forEach((id) => {
        exec(`pm2 restart ${id}`, (err) => {
          if (err) {
            console.error(`Failed to restart PM2 service "${id}":`, err.message);
          } else {
            console.log(`PM2 service "${id}" restarted successfully`);
          }
        });
      });
    }

    return {
      totalProcessed: validDevices.length,
      totalCreated,
      totalSkipped: allFailed.length,
      failed: allFailed,
      batchResults,
      summary: {
        message: `${totalCreated} created, ${allFailed.length} failed out of ${validDevices.length} total`,
        totalBatches,
        batchSize,
      },
    };
  } catch (error) {
    console.error('Error uploading device:', error);
    throw error;
  }
};

const uploadDeviceWithProgress = async (devicesFromXL, batchSize = 100, progressCallback = null) => {
  return uploadDevice(devicesFromXL, batchSize);

  // kept for legacy callers — progress is now returned in batchResults
  try {
    let CATCH_COUNT = 1000;
    let PREFIX_TABLE_NAME = "deviceLog_";

    const totalDevicesCount = await prisma.device.count();
    const _tableNames = new Set();
    
    // Filter out devices without valid imeinumber
    const validDevices = devicesFromXL.filter(device => 
      device.imeinumber && String(device.imeinumber).trim() !== ''
    );
    
    if (validDevices.length === 0) {
      throw new Error('No valid devices found with imeinumber');
    }

    console.log(`Starting batch upload for ${validDevices.length} devices with batch size: ${batchSize}`);
    
    const devicesTransformed = validDevices.map((device, index) => {
      const tableName =
        PREFIX_TABLE_NAME +
        Math.ceil((totalDevicesCount + index + 1) / CATCH_COUNT);
      _tableNames.add(tableName);

      // Ensure imeinumber is a string and not null/undefined
      const imeinumberStr = String(device.imeinumber || '');
      
      return { 
        macsoftmqtturl: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
        macsoftmqttusername: `device_${device.imeinumber}`,
        macsoftmqttclientid: `device_${device.imeinumber}`,
        macsoftmqttpassword: bcrypt.hashSync(imeinumberStr, 10),
        pubtopicdata: `device/${device.imeinumber}/data`,
        macsoftmqttsubtopiccmd: `device/${device.imeinumber}/cmd`,
        macsoftmqttpubtopiccmd: `device/${device.imeinumber}/cmd/response`,
        imeinumber: String(device.imeinumber),
        tableName: tableName,
      };
    });

    // Process devices in batches
    const totalBatches = Math.ceil(devicesTransformed.length / batchSize);
    let totalProcessed = 0;
    let totalCreated = 0;
    const results = [];
    const startTime = Date.now();

    for (let i = 0; i < totalBatches; i++) {
      const batchStartTime = Date.now();
      const startIndex = i * batchSize;
      const endIndex = Math.min(startIndex + batchSize, devicesTransformed.length);
      const batch = devicesTransformed.slice(startIndex, endIndex);
      
      console.log(`Processing batch ${i + 1}/${totalBatches} (${batch.length} devices)`);
      
      try {
        const batchResult = await prisma.device.createMany({
          data: batch,
          skipDuplicates: true,
        });
        
        totalCreated += batchResult.count;
        totalProcessed += batch.length;
        const batchTime = Date.now() - batchStartTime;
        
        const batchInfo = {
          batchNumber: i + 1,
          processed: batch.length,
          created: batchResult.count,
          skipped: batch.length - batchResult.count,
          processingTime: batchTime,
          estimatedTimeRemaining: totalBatches > i + 1 ? 
            ((Date.now() - startTime) / (i + 1)) * (totalBatches - i - 1) : 0
        };
        
        results.push(batchInfo);
        
        console.log(`Batch ${i + 1} completed: ${batchResult.count} created, ${batch.length - batchResult.count} skipped (${batchTime}ms)`);
        
        // Call progress callback if provided
        if (progressCallback && typeof progressCallback === 'function') {
          progressCallback({
            currentBatch: i + 1,
            totalBatches,
            processedDevices: totalProcessed,
            createdDevices: totalCreated,
            totalDevices: validDevices.length,
            progress: ((i + 1) / totalBatches) * 100,
            batchInfo
          });
        }
        
        // Small delay between batches to prevent overwhelming the database
        if (i < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
      } catch (batchError) {
        console.error(`Error in batch ${i + 1}:`, batchError);
        const errorInfo = {
          batchNumber: i + 1,
          processed: batch.length,
          created: 0,
          error: batchError.message,
          processingTime: Date.now() - batchStartTime
        };
        results.push(errorInfo);
        
        // Call progress callback for error case
        if (progressCallback && typeof progressCallback === 'function') {
          progressCallback({
            currentBatch: i + 1,
            totalBatches,
            processedDevices: totalProcessed,
            createdDevices: totalCreated,
            totalDevices: validDevices.length,
            progress: ((i + 1) / totalBatches) * 100,
            batchInfo: errorInfo,
            error: batchError.message
          });
        }
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`Upload completed: ${totalCreated} devices created out of ${totalProcessed} processed in ${totalTime}ms`);

    return { 
      totalProcessed,
      totalCreated,
      totalSkipped: totalProcessed - totalCreated,
      batchResults: results,
      summary: {
        totalDevices: validDevices.length,
        batchSize,
        totalBatches,
        successfulBatches: results.filter(r => !r.error).length,
        failedBatches: results.filter(r => r.error).length,
        totalProcessingTime: totalTime,
        averageTimePerBatch: totalTime / totalBatches,
        averageTimePerDevice: totalTime / totalProcessed
      }
    };
  } catch (error) {
    console.error("Error uploading device:", error);
    throw error;
  }
};

module.exports = {
  uploadDevice,
  uploadDeviceWithProgress,
};

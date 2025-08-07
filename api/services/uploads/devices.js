const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const uploadDevice = async (devicesFromXL, batchSize = 100) => {
  try {
    let CATCH_COUNT = 1000;
    let PREFIX_TABLE_NAME = "devicelog_";

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
         host: process.env.MQTT_HOST,
        port: parseInt(process.env.MQTT_PORT),
        username: `device_${device.imeinumber}`,
        password: bcrypt.hashSync(imeinumberStr, 10),
        pubTopicData: `device/${device.imeinumber}/data`,
        subTopicCmd: `device/${device.imeinumber}/cmd`,
        pubTopicCmd: `device/${device.imeinumber}/cmd/response`,
        imeinumber: String(device.imeinumber),
        tablename: tableName,
      };
    });

    // Process devices in batches
    const totalBatches = Math.ceil(devicesTransformed.length / batchSize);
    let totalProcessed = 0;
    let totalCreated = 0;
    const results = [];

    for (let i = 0; i < totalBatches; i++) {
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
        
        results.push({
          batchNumber: i + 1,
          processed: batch.length,
          created: batchResult.count,
          skipped: batch.length - batchResult.count
        });
        
        console.log(`Batch ${i + 1} completed: ${batchResult.count} created, ${batch.length - batchResult.count} skipped`);
        
        // Small delay between batches to prevent overwhelming the database
        if (i < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
      } catch (batchError) {
        console.error(`Error in batch ${i + 1}:`, batchError);
        results.push({
          batchNumber: i + 1,
          processed: batch.length,
          created: 0,
          error: batchError.message
        });
      }
    }

    console.log(`Upload completed: ${totalCreated} devices created out of ${totalProcessed} processed`);

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
        failedBatches: results.filter(r => r.error).length
      }
    };
  } catch (error) {
    console.error("Error uploading device:", error);
    throw error; // Re-throw the error so it can be handled by the controller
  }
};

const uploadDeviceWithProgress = async (devicesFromXL, batchSize = 100, progressCallback = null) => {
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
         host: process.env.MQTT_HOST,
        port: parseInt(process.env.MQTT_PORT),
        username: `device_${device.imeinumber}`,
        password: bcrypt.hashSync(imeinumberStr, 10),
        pubTopicData: `device/${device.imeinumber}/data`,
        subTopicCmd: `device/${device.imeinumber}/cmd`,
        pubTopicCmd: `device/${device.imeinumber}/cmd/response`,
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

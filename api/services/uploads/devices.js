const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uploadDevice = async (devicesFromXL) => {
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

    console.log(`Starting upload for ${validDevices.length} devices (passwords pre-hashed on frontend)`);

    const devicesTransformed = validDevices.map((device, index) => {
      const tableName =
        PREFIX_TABLE_NAME +
        Math.ceil((totalDevicesCount + index + 1) / CATCH_COUNT);
      _tableNames.add(tableName);

      return {
        macsoftmqtturl: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
        macsoftmqttusername: `device_${device.imeinumber}`,
        macsoftmqttclientid: `device_${device.imeinumber}`,
        macsoftmqttpassword: device.hashedPassword || null, // Use pre-hashed password from frontend
        macsoftmqttpubtopicdata: `device/${device.imeinumber}/data`,
        macsoftmqttsubtopiccmd: `device/${device.imeinumber}/cmd`,
        macsoftmqttpubtopiccmd: `device/${device.imeinumber}/cmd/response`,
        imeinumber: String(device.imeinumber),
        tablename: tableName,
      };
    });

    // Process all devices at once since passwords are already hashed
    let totalProcessed = 0;
    let totalCreated = 0;
    
    console.log(`Processing all ${devicesTransformed.length} devices in single operation`);
    
    try {
      const result = await prisma.device.createMany({
        data: devicesTransformed,
        skipDuplicates: true,
      });
      
      totalCreated = result.count;
      totalProcessed = devicesTransformed.length;
      
      console.log(`Upload completed: ${totalCreated} devices created, ${totalProcessed - totalCreated} skipped (duplicates)`);
      
    } catch (error) {
      console.error(`Error in device upload:`, error);
      throw error;
    }

    return { 
      totalProcessed,
      totalCreated,
      totalSkipped: totalProcessed - totalCreated,
      summary: {
        totalDevices: validDevices.length,
        successfulCreations: totalCreated,
        skippedDuplicates: totalProcessed - totalCreated,
        processingMethod: 'single_operation',
        passwordsPreHashed: true
      }
    };
  } catch (error) {
    console.error("Error uploading device:", error);
    throw error; // Re-throw the error so it can be handled by the controller
  }
};
 
module.exports = {
  uploadDevice,
 };

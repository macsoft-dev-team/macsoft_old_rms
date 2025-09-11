const { PrismaClient } = require("@prisma/client");
const { createNotification } = require("../notification");
const prisma = new PrismaClient();

const uploadDevice = async (devicesFromXL, user) => {
  try {
    let CATCH_COUNT = 1000;
    let PREFIX_TABLE_NAME = "deviceLog_";

    const totalDevicesCount = await prisma.device.count();
    const _tableNames = new Set();

    // Filter out devices without valid imeinumber
    const validDevices = devicesFromXL.filter(
      (device) => device.imeinumber && String(device.imeinumber).trim() !== ""
    );

    if (validDevices.length === 0) {
      throw new Error("No valid devices found with imeinumber");
    }

    console.log(
      `Starting upload for ${validDevices.length} devices (passwords pre-hashed on frontend)`
    );
    let devicesTransformed = [];

    devicesTransformed = validDevices.map((device, index) => {
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

    if (user.role === "CUSTOMER_ADMIN" || user.role === "CUSTOMER_USER") {
      devicesTransformed.forEach((device) => {
        device.customerId = user.customerId;
      });
    }

    // Process all devices at once since passwords are already hashed
    let totalProcessed = 0;
    let totalCreated = 0;

    console.log(
      `Processing all ${devicesTransformed.length} devices in single operation`
    );

    try {
      let result = [];
      for (const item of devicesTransformed) {
        try {
          let res = await prisma.device.upsert({
            where: { imeinumber: item.imeinumber },
            update: {
              ...item,
            },
            create: item,
          });
          result.push(res);
        } catch (error) {
          console.error(
            `Error processing device ${item.imeinumber}:`,
            error
          );
        }
      }

      totalCreated = result.length;
      totalProcessed = devicesTransformed.length;

      console.log(
        `Upload completed: ${totalCreated} devices created, ${
          totalProcessed - totalCreated
        } skipped (duplicates)`
      );
    } catch (error) {
      console.error(`Error in device upload:`, error);
      throw error;
    }
    const notification = await createNotification({
      user: user,
      eventType: "crud",
      title: "Device Upload Completed",
      message: `Device upload completed. ${totalCreated} devices created, ${
        totalProcessed - totalCreated
      } duplicates skipped.`,
    });

    return {
      totalProcessed,
      totalCreated,
      notification,
      totalSkipped: totalProcessed - totalCreated,
      summary: {
        totalDevices: validDevices.length,
        successfulCreations: totalCreated,
        skippedDuplicates: totalProcessed - totalCreated,
        processingMethod: "single_operation",
        passwordsPreHashed: true,
      },
    };
  } catch (error) {
    console.error("Error uploading device:", error);
    throw error; // Re-throw the error so it can be handled by the controller
  }
};

module.exports = {
  uploadDevice,
};

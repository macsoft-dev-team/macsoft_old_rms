const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { createNotification } = require("../notification");
const prisma = new PrismaClient();

const uploadDevice = async (devicesFromXL, batchSize = 100,user) => {
  try {
    // Filter out devices with valid imeinumber
    const validDevices = devicesFromXL.filter(
      (device) => device.imeinumber && String(device.imeinumber).trim() !== ""
    );

    if (validDevices.length === 0) {
      throw new Error("No valid devices found with imeinumber");
    }

    console.log(
      `Starting batch update for ${validDevices.length} devices with batch size: ${batchSize}`
    );

    const devicesTransformed = await Promise.all(
      validDevices.map((device) => ({
        ...device,
        imeinumber: String(device.imeinumber),
        snamqttpassword: device.snamqttpassword
          ? bcrypt.hashSync(device.snamqttpassword, 10)
          : null,
      }))
    );

    // Batch processing
    const totalBatches = Math.ceil(devicesTransformed.length / batchSize);
    const results = [];
    let totalUpdated = 0;
    let totalCreated = 0;

    for (let i = 0; i < totalBatches; i++) {
      const batch = devicesTransformed.slice(
        i * batchSize,
        (i + 1) * batchSize
      );

      console.log(`Processing batch ${i + 1}/${totalBatches}`);

      // Run all upserts in parallel for the batch
      const batchResults = await Promise.all(
        batch.map(async (device) => {
          try {
            const result = await prisma.device.upsert({
              where: {
                imeinumber: device.imeinumber,
              },
              update: {
                snamqtturl: device.snamqtturl ?? undefined,
                snamqttusername: device.snamqttusername ?? undefined,
                snamqttpassword: device.snamqttpassword ?? undefined,
                snamqttpubtopicdata: device.snamqttpubtopicdata ?? undefined,
                snamqttsubtopiccmd: device.snamqttsubtopiccmd ?? undefined,
                snamqttsubtopiccmdresponse:
                  device.snamqttsubtopiccmdresponse ?? undefined,
              },
              create: {
                imeinumber: device.imeinumber,
                snamqtturl: device.snamqtturl ?? undefined,
                snamqttusername: device.snamqttusername ?? undefined,
                snamqttpassword: device.snamqttpassword ?? undefined,
                snamqttpubtopicdata: device.snamqttpubtopicdata ?? undefined,
                snamqttsubtopiccmd: device.snamqttsubtopiccmd ?? undefined,
                snamqttsubtopiccmdresponse:
                  device.snamqttsubtopiccmdresponse ?? undefined,
              },
            });
            return result;
          } catch (err) {
            return {
              imeinumber: device.imeinumber,
              status: "error",
              error: err.message,
            };
          }
        })
      );

      // Update counters
      batchResults.forEach((r) => {
        if (r.status === "upserted") totalUpdated++;
        else if (r.status === "created") totalCreated++;
      });

      results.push({
        batchNumber: i + 1,
        processed: batch.length,
        errors: batchResults.filter((r) => r.status === "error"),
      });

      if (i < totalBatches - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

      const notification = await createNotification({
        user: user,
        eventType: "crud",
        title: "Mapping SNA Upload Completed",
        message: `Mapping SNA upload updated ${totalUpdated} devices`,
      });

    return {
      totalProcessed: devicesTransformed.length,
      totalUpdated,
      totalCreated,
      notification,
      batchResults: results,
    };
  } catch (error) {
    console.error("Error uploading device:", error);
    throw error;
  }
};

module.exports = {
  uploadDevice,
};

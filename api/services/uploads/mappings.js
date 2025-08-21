const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const uploadDevice = async (devicesFromXL, batchSize = 100) => {
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
     validDevices.map(async (device) => ({
       imeinumber: String(device.imeinumber).trim(),
       snahost: device.snahost,
       snaport: device.snaport,
       snausername: device.snausername,
       snapassword: device.snapassword
         ? await bcrypt.hash(device.snapassword, 10)
         : null,
       snapubTopicData: device.snapubTopicData,
       snasubTopicCmd: device.snasubTopicCmd,
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
              where: { imeinumber: device.imeinumber },
              update: {
                snahost: device.snahost,
                snaport: device.snaport,
                snausername: device.snausername,
                snapassword: device.snapassword,
                snapubTopicData: device.snapubTopicData,
                snasubTopicCmd: device.snasubTopicCmd,
              },
              create: device,
            });
            return { imeinumber: device.imeinumber, status: "upserted" };
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

    return {
      totalProcessed: devicesTransformed.length,
      totalUpdated,
      totalCreated,
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

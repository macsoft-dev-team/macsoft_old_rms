const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { createNotification } = require("../notification");
const prisma = new PrismaClient();

const uploadCustomer = async (customersFromXL, batchSize = 100, user) => {
  try {
    // Filter out customers without valid email
    const validCustomers = customersFromXL.filter(
      (customer) => customer.email && String(customer.email).trim() !== ""
    );

    if (validCustomers.length === 0) {
      throw new Error("No valid customers found with imeinumber");
    }

    console.log(
      `Starting batch upload for ${validCustomers.length} customers with batch size: ${batchSize}`
    );

    // Process customers in batches
    const totalBatches = Math.ceil(validCustomers.length / batchSize);
    let totalProcessed = 0;
    let totalCreated = 0;
    const results = [];

    for (let i = 0; i < totalBatches; i++) {
      const startIndex = i * batchSize;
      const endIndex = Math.min(startIndex + batchSize, validCustomers.length);
      const batch = validCustomers.slice(startIndex, endIndex);

      console.log(
        `Processing batch ${i + 1}/${totalBatches} (${batch.length} customers)`
      );

      try {
        const batchResult = await prisma.customer.createMany({
          data: batch,
          skipDuplicates: true,
        });

        totalCreated += batchResult.count;
        totalProcessed += batch.length;

        results.push({
          batchNumber: i + 1,
          processed: batch.length,
          created: batchResult.count,
          skipped: batch.length - batchResult.count,
        });

        console.log(
          `Batch ${i + 1} completed: ${batchResult.count} created, ${
            batch.length - batchResult.count
          } skipped`
        );

        // Small delay between batches to prevent overwhelming the database
        if (i < totalBatches - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } catch (batchError) {
        console.error(`Error in batch ${i + 1}:`, batchError);
        results.push({
          batchNumber: i + 1,
          processed: batch.length,
          created: 0,
          error: batchError.message,
        });
      }
    }

    console.log(
      `Upload completed: ${totalCreated} customers created out of ${totalProcessed} processed`
    );
    const notification = await createNotification({
      user: user,
      eventType: "crud",
      title: "Customer Upload Completed",
      message: `Customer upload completed. ${totalCreated} customers created, ${
        totalProcessed - totalCreated
      } duplicates skipped.`,
    });
    return {
      totalProcessed,
      totalCreated,
      totalSkipped: totalProcessed - totalCreated,
      batchResults: results,
      notification,
      summary: {
        totalCustomers: validCustomers.length,
        batchSize,
        totalBatches,
        successfulBatches: results.filter((r) => !r.error).length,
        failedBatches: results.filter((r) => r.error).length,
      },
    };
  } catch (error) {
    console.error("Error uploading customer:", error);
    throw error;
  }
};

module.exports = {
  uploadCustomer,
};

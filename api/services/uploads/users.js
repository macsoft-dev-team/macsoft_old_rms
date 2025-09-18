const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const uploadUsers = async (usersFromXL, batchSize = 100) => {
  try {
    const validUsers = usersFromXL.filter(
      (user) => user.imeinumber && String(user.imeinumber).trim() !== ""
    );

    if (validUsers.length === 0) {
      throw new Error("No valid users found with imeinumber");
    }

    console.log(
      `Starting batch upload for ${validUsers.length} users with batch size: ${batchSize}`
    );

    const usersTransformed = validUsers.map((user, index) => {
      return {
        ...user,
        password: bcrypt.hashSync(imeinumberStr, 10),
      };
    });

    const totalBatches = Math.ceil(usersTransformed.length / batchSize);
    let totalProcessed = 0;
    let totalCreated = 0;
    const results = [];

    for (let i = 0; i < totalBatches; i++) {
      const startIndex = i * batchSize;
      const endIndex = Math.min(
        startIndex + batchSize,
        usersTransformed.length
      );
      const batch = usersTransformed.slice(startIndex, endIndex);

      console.log(
        `Processing batch ${i + 1}/${totalBatches} (${batch.length} users)`
      );

      try {
        const batchResult = await prisma.user.createMany({
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
      `Upload completed: ${totalCreated} users created out of ${totalProcessed} processed`
    );

    return {
      totalProcessed,
      totalCreated,
      totalSkipped: totalProcessed - totalCreated,
      batchResults: results,
      summary: {
        totalUsers: validUsers.length,
        batchSize,
        totalBatches,
        successfulBatches: results.filter((r) => !r.error).length,
        failedBatches: results.filter((r) => r.error).length,
      },
    };
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      operation: "upload",
      title: "User Upload Failed",
      message: `Error - ${error.message}`,
    });
    throw error;
  }
};

module.exports = {
  uploadUsers,
};

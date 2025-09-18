const { PrismaClient } = require("@prisma/client");
const { createNotification } = require("./notification");
const prisma = new PrismaClient();

const getDeviceLogs = async (
  skip,
  take,
  fromDate,
  toDate,
  imeinumber,
  tablename
) => {
  try {
    const where = {
      imeinumber,
    };
    if (fromDate) where.timestamp = { gte: new Date(fromDate) };
    if (toDate) {
      where.timestamp = where.timestamp || {};
      // Make end date inclusive by setting less than next day
      const nextDay = new Date(toDate);
      nextDay.setDate(nextDay.getDate() + 1);
      where.timestamp.lt = nextDay;
    }

    let paginationParams = {};
    if (skip)
      paginationParams.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
    if (take) paginationParams.take = parseInt(take);

    // Use Prisma model dynamically
    const model = prisma[tablename];
    if (!model) throw new Error(`Model for table ${tablename} not found`);

    const [rows, count] = await Promise.all([
      model.findMany({
        where,
        orderBy: { timestamp: "desc" },
        ...paginationParams,
      }),
      model.count({ where }),
    ]);

    return { rows, count };
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Fetch Device Logs Failed",
      operation: "fetch",
      message: `Error - ${error.message}`,
    });
    throw new Error("Could not fetch device logs");
  }
};

module.exports = {
  getDeviceLogs,
};

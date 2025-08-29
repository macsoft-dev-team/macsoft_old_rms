const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDeviceLogs = async (skip, take, fromDate, toDate, imeinumber, tablename) => {
  // Get tablename from the params
  // Build Prisma where clause
  const where = {
    imeinumber,
  };
  if (fromDate) where.created_at = { gte: new Date(fromDate) };
  if (toDate) {
    where.created_at = where.created_at || {};
    // Make end date inclusive by setting less than next day
    const nextDay = new Date(toDate);
    nextDay.setDate(nextDay.getDate() + 1);
    where.created_at.lt = nextDay;
  }

  let paginationParams = {};
  if (skip) paginationParams.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
  if (take) paginationParams.take = parseInt(take);

  // Use Prisma model dynamically
  const model = prisma[tablename];
  if (!model) throw new Error(`Model for table ${tablename} not found`);

  const [rows, count] = await Promise.all([
    model.findMany({
      where,
      orderBy: { created_at: 'desc' },
      ...paginationParams,
    }),
    model.count({ where }),
  ]);

  return { rows, count };
};

module.exports = {
  getDeviceLogs
};
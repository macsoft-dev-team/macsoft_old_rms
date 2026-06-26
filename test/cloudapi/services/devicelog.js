const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDeviceLogs = async (skip, take, fromDate, toDate, imeinumber, tablename) => {
  // Build Prisma where clause
  // Dates from the UI are "YYYY-MM-DD" strings. Append time without 'Z' so Node.js
  // parses them as local time — matching the timezone used by the CLI when storing records.
  const where = {
    imeinumber,
  };
  if (fromDate || toDate) {
    where.timestamp = {};
    if (fromDate) where.timestamp.gte = new Date(fromDate + 'T00:00:00');
    if (toDate)   where.timestamp.lte = new Date(toDate   + 'T23:59:59.999');
  }

  let paginationParams = {};
  if (skip) paginationParams.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
  if (take) paginationParams.take = parseInt(take);

  // Use Prisma model dynamically
  const model = prisma[tablename];
  if (!model) throw new Error(`Model for table ${tablename} not found`);

  const rows = await model.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    ...paginationParams,
  });
  
  const count = await model.count({ where });

  return { rows, count };
};

const exportDeviceLogs = async (fromDate, toDate, imeinumber, tablename) => {
  const where = { imeinumber };
  if (fromDate || toDate) {
    where.timestamp = {};
    if (fromDate) where.timestamp.gte = new Date(fromDate + 'T00:00:00');
    if (toDate)   where.timestamp.lte = new Date(toDate   + 'T23:59:59.999');
  }

  const model = prisma[tablename];
  if (!model) throw new Error(`Model for table ${tablename} not found`);

  const rows = await model.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  });

  return rows;
};

module.exports = {
  getDeviceLogs,
  exportDeviceLogs,
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDeviceLogs = async (skip, take, fromDate, toDate, imeinumber) => {
  // Get tablename for the device
  const deviceResult = await prisma.device.findFirst({
    where: { imeinumber },
    select: { tablename: true }
  });
  if (!deviceResult || !deviceResult.tablename) {
    throw new Error(
      `Device with IMEI ${imeinumber} not found or has no tablename`
    );
  }

  const tablename = deviceResult.tablename;

  // Build Prisma where clause
  const where = {
    imeinumber,
  };
  if (fromDate) where.created_at = { gte: new Date(fromDate) };
  if (toDate) {
    where.created_at = where.created_at || {};
    where.created_at.lte = new Date(toDate);
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
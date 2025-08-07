const connect = require('../db/mysql');

const getDeviceLogs = async (skip, take, fromDate, toDate, imeinumber) => {
  const connection = await connect();
 
  const [deviceResult] = await connection.execute(
    "SELECT tablename FROM device WHERE imeinumber = ?",
    [imeinumber]
  );
  if (!deviceResult.length || !deviceResult[0].tablename) {
    throw new Error(
      `Device with IMEI ${imeinumber} not found or has no tablename`
    );
  }

  const tablename = deviceResult[0].tablename;

  let whereClause = 'WHERE imeinumber = ?';
  let params = [imeinumber];
  
  if (fromDate) {
    whereClause += ' AND created_at >= ?';
    params.push(fromDate);
  }
  if (toDate) {
    whereClause += ' AND created_at <= ?';
    params.push(toDate);
  }
  let paginationParams = {};
  if (skip) paginationParams.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
  if (take) paginationParams.take = parseInt(take);
  
  const limit = paginationParams.take || 10;
  const offset = paginationParams.skip || 0;

  const [rows, countResult] = await Promise.all([
    connection.execute(
      `SELECT * FROM ${tablename} ${whereClause} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params
    ),
    connection.execute(
      `SELECT COUNT(*) as count FROM ${tablename} ${whereClause}`,
      params
    ),
  ]);

  await connection.end();
  return { rows: rows[0], count: countResult[0][0].count };
};

module.exports = {
  getDeviceLogs
}; 
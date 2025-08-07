const devicelog = require("../services/devicelog");

const getDeviceLogs = async (req, res) => {
  try {
    const { skip = 0, take = 10, fromDate, toDate, tablename } = req.query;
    const { imeinumber } = req.params; 
    
    const { rows, count } = await devicelog.getDeviceLogs(
      skip,
      take,
      fromDate,
      toDate,
      imeinumber,
      tablename
    );
    
    const result = {
      devicelog: rows,
      totalPages: Math.ceil(count / take),
      currentPage: parseInt(skip) || 1,
      totalCount: count
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching device logs:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getDeviceLogs,
};

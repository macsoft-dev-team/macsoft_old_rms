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
const exportDeviceLogs = async (req, res) => {
  try {
    const { fromDate, toDate, tablename } = req.query;
    const { imeinumber } = req.params;

    const rows = await devicelog.exportDeviceLogs(fromDate, toDate, imeinumber, tablename);

    if (!rows.length) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="devicelog_${imeinumber}.csv"`);
      return res.status(200).send('');
    }

    const headers = Object.keys(rows[0]);
    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="devicelog_${imeinumber}_${Date.now()}.csv"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting device logs:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDeviceLogs,
  exportDeviceLogs,
};

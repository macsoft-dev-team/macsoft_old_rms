const deviceLogService = require('../services/deviceLog');

const getDeviceLogs = async (req, res) => {
    const { skip, take, filter } = req.query;
    try {
        const { deviceLogs, count } = await deviceLogService.getDeviceLogs(skip, take, filter);
        res.json({ deviceLogs, currentPage: parseInt(skip) || 1, totalPages: Math.ceil(count / (take || 10)) });
    } catch (error) {
        console.error('Error fetching device logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getDeviceLogs,
};

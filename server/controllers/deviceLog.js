const deviceLogService = require('../services/deviceLog');

const getDeviceLogs = async (req, res) => {
    const { skip, take, filter, startDate, endDate } = req.query;
    try {
        let filterObj = filter;
        if (typeof filter === 'string') {
            filterObj = { text: filter };
        }
        if (startDate || endDate) {
            filterObj = {
                ...(filterObj && typeof filterObj === 'object' ? filterObj : {}),
                startDate,
                endDate,
            };
        }
        const { deviceLogs, count } = await deviceLogService.getDeviceLogs(skip, take, filterObj);
        res.json({ deviceLogs, currentPage: parseInt(skip) || 1, totalPages: Math.ceil(count / (take || 10)) });
    } catch (error) {
        console.error('Error fetching device logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getDeviceLogs,
};

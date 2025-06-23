const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getDeviceLogs = async (skip, take, filter) => {
    try {
        const params = {};
        if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take || 10);
        if (take) params.take = parseInt(take);

        params.where = {};

        if (filter) {
            // Text search
            if (filter.text) {
                params.where.OR = [
                    { imeinumber: { contains: filter.text } },
                    { messageType: { contains: filter.text } },
                    { payload: { contains: filter.text } },
                ];
            }
            // Date range
            if (filter.startDate || filter.endDate) {
                params.where.receivedAt = {};
                if (filter.startDate) {
                    params.where.receivedAt.gte = new Date(filter.startDate);
                }
                if (filter.endDate) {
                    params.where.receivedAt.lte = new Date(filter.endDate);
                }
            }
        }

        // Order by receivedAt descending
        params.orderBy = { receivedAt: 'desc' };

        const count = await prisma.deviceLog.count({
            where: params.where,
        });
        let deviceLogs = await prisma.deviceLog.findMany(params);
        deviceLogs = deviceLogs.map(log => {
            data = log.payload;
            return {
                ...data,
                receivedAt: log.receivedAt.toISOString(),
            };
        });
        return { deviceLogs, count };
    } catch (error) {
        console.error('Error fetching device logs:', error);
        throw new Error('Internal server error');
    }
};

module.exports = {
    getDeviceLogs,
};

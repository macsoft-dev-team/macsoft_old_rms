const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getDeviceLogs = async (skip, take, filter) => {
    try {
        const params = {};
        if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take || 10);
        if (take) params.take = parseInt(take);
        if (filter) {
        params.where = {
            OR: [
            { imeinumber: { contains: filter } },
            { messageType: { contains: filter } },
            { payload: { contains: filter } },
            ],
        };

        // Filter between dates if provided
        if (filter.startDate && filter.endDate) {
            params.where.receivedAt = {
                gte: new Date(filter.startDate),
                lte: new Date(filter.endDate),
            };
        }
        }
        const count = await prisma.deviceLog.count({
        where: params.where || {},
        });
        const deviceLogs = await prisma.deviceLog.findMany(params);
        return { deviceLogs, count };
    } catch (error) {
        console.error('Error fetching device logs:', error);
        throw new Error('Internal server error');
    }
};

module.exports = {
    getDeviceLogs,
};
 
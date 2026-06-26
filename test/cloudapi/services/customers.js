const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getAllCustomers = async (skip, take, filter, user) => {
  if (!user || user.role !== 'MACSOFT_ADMIN') {
    const err = new Error('Unauthorized');
    err.status = 403;
    throw err;
  }
  try {
    const params = {};
    if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
    if (take) params.take = parseInt(take);

    let where = {};
    if (filter) {
      where.AND = [
        filter.search && {
          OR: [
            { email: { contains: filter.search } },
            { name: { contains: filter.search } },
          ],
        },
      ].filter(Boolean);
    }

    params.where = where;

    const count = await prisma.customer.count({ where: params.where });
    const customers = await prisma.customer.findMany({
      ...params,
      include: { devices: true, users: true },
    });
    return { customers, count };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Could not fetch customers");
  }
};


const getCustomerById = async (id, user) => {
  if (!user || user.role !== 'MACSOFT_ADMIN') {
    const err = new Error('Unauthorized');
    err.status = 403;
    throw err;
  }
  return prisma.customer.findUnique({
    where: { id: id },
    include: { devices: true, users: true },
  });
};


const createCustomer = async (data, user) => {
  if (!user || user.role !== 'MACSOFT_ADMIN') {
    const err = new Error('Unauthorized');
    err.status = 403;
    throw err;
  }
  return prisma.customer.create({ data });
};


const updateCustomer = async (id, data, user) => {
  if (!user || user.role !== 'MACSOFT_ADMIN') {
    const err = new Error('Unauthorized');
    err.status = 403;
    throw err;
  }
  return prisma.customer.update({ where: { id: id }, data });
};


const deleteCustomer = async (id, user) => {
  if (!user || user.role !== 'MACSOFT_ADMIN') {
    const err = new Error('Unauthorized');
    err.status = 403;
    throw err;
  }
  return prisma.customer.delete({ where: { id: id } });
};


const getCustomerDevices = async (customerId, user) => {
  if (!user || user.role !== 'MACSOFT_ADMIN') {
    const err = new Error('Unauthorized');
    err.status = 403;
    throw err;
  }
  return prisma.device.findMany({ where: { customerId } });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerDevices,
};

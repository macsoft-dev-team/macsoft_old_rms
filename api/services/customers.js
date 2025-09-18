const { PrismaClient } = require("@prisma/client");
const { createNotification } = require("./notification");
const prisma = new PrismaClient();

const getAllCustomers = async (skip, take, filter, user) => {
  if (!user || user.role !== "MACSOFT_ADMIN") {
    const err = new Error("Unauthorized");
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
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Fetch Customers Failed",
      operation: "fetch",
      message: `Error - ${error.message}`,
    });
    throw new Error("Could not fetch customers");
  }
};

const getCustomerById = async (id, user) => {
  try {
    if (!user || user.role !== "MACSOFT_ADMIN") {
      const err = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }
    const customer = await prisma.customer.findUnique({
      where: { id: id },
      include: { devices: true, users: true },
    });

    return customer;
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Fetch Customer Failed",
      operation: "fetch",
      message: `Error - ${error.message}`,
    });
    throw new Error("Could not fetch customer");
  }
};

const createCustomer = async (data, user) => {
  try {
    if (!user || user.role !== "MACSOFT_ADMIN") {
      const err = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }
    const customer = await prisma.customer.create({ data });
   await createNotification({
     user: user,
     eventType: "crud",
     operation: "create",
     title: "New Customer Created",
     message: `Error - ${error.message}`,
   });
    return customer;
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Customer Creation Failed",
      operation: "create",
      message: `Failed to create customer - ${data.name} : ${data.email}`,
    });
    throw new Error("Could not create customer");
  }
};

const updateCustomer = async (id, data, user) => {
  try {
    if (!user || user.role !== "MACSOFT_ADMIN") {
      const err = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }
    const customer = await prisma.customer.update({ where: { id: id }, data });
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Customer Updated",
      operation: "update",
      message: `Customer updated - ${customer.name} : ${customer.email}`,
    });
    return customer;
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Customer Update Failed",
      operation: "update",
      message: `Error - ${error.message}`,
    });
    throw new Error("Could not update customer");
  }
};

const deleteCustomer = async (id, user) => {
  try {
    if (!user || user.role !== "MACSOFT_ADMIN") {
      const err = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }
    const customer = await prisma.customer.delete({ where: { id: id } });
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Customer Deleted",
      operation: "delete",
      message: `Customer deleted - ${customer.name} : ${customer.email}`,
    });
    return customer;
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Customer Deletion Failed",
      operation: "delete",
      message: `Error - ${error.message}`,
    });
    throw new Error("Could not delete customer");
  }
};

const getCustomerDevices = async (customerId, user) => {
  try {
    if (!user || user.role !== "MACSOFT_ADMIN") {
      const err = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }
    return prisma.device.findMany({ where: { customerId } });
  } catch (error) {
    await createNotification({
      user: user,
      eventType: "crud",
      title: "Fetch Customer Devices Failed",
      operation: "fetch",
      message: `Error - ${error.message}`,
    });
    throw new Error("Could not fetch customer devices");
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerDevices,
};

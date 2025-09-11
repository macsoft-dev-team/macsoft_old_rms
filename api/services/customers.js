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
    console.error("Error fetching customers:", error);
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
    
    return customer
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
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
     const notification = await createNotification({
       user: user,
       eventType: "crud",
       title: "New Customer Created",
       message: `New customer created - ${customer.name} : ${customer.email}`,
     });
    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
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
    const notification = await createNotification({
      user: user,
      eventType: "crud",
      title: "Customer Updated",
      message: `Customer updated - ${customer.name} : ${customer.email}`,
    });
    return customer;
  } catch (error) {
    console.error("Error updating customer:", error);
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
    const notification = await createNotification({
      user: user,
      eventType: "crud",
      title: "Customer Deleted",
      message: `Customer deleted - ${customer.name} : ${customer.email}`,
    });
    return customer;
  } catch (error) {
    console.error("Error deleting customer:", error);
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
    console.error("Error fetching customer devices:", error);
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

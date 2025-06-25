const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCustomers = async (skip, take, filter) => {
  try {
    const params = {};
    if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
    if (take) params.take = parseInt(take);
    if (filter)
      params.where = {
        OR: [
          { name: { contains: filter } },
          { email: { contains: filter } },
          { phone: { contains: filter } },
        ],
      };
    const count = await prisma.customer.count({ where: params.where || {} });
    const customers = await prisma.customer.findMany(params);
    return { customers, count };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

const getCustomerById = async (id) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw error;
  }
};

const createCustomer = async (data) => {
  try {
    const { name, email, phone, address, deviceId } = data;
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        deviceId,
    },
    });
    return newCustomer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

const updateCustomer = async (id, data) => {
  try {
    const { name, email, phone, status } = data;
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        deviceId,
       },
    });
    return updatedCustomer;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

const deleteCustomer = async (id) => {
  try {
    await prisma.customer.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUsers = async (skip, take, filter, user) => {
  try {
    const params = {};

    if (skip) params.skip = (parseInt(skip) - 1) * (parseInt(take) || 0);
    if (take) params.take = parseInt(take);

    params.where = {};
    if (filter?.search) {
      params.where.name = {
        contains: filter.search,
      };
    }

    if (
      user.customerId &&
      user.role !== "MACSOFT_ADMIN" &&
      user.role !== "MACSOFT_USER"
    ) {
      params.where.customerId = user.customerId;
    }

    const count = await prisma.user.count({
      where: params.where,
    });

    const users = await prisma.user.findMany(params);

    return { users, count };
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

const createUser = async (userData) => {
  try {
    const newUser = await prisma.user.create({
      data: userData,
    });
    return newUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

const updateUser = async (id, userData) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user");
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    throw new Error("Error deleting user");
  }
};
const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser,
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const getUsers = async (skip, take, filter) => {
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
    const count = await prisma.user.count({ where: params.where || {} });
    const users = await prisma.user.findMany(params);
    return { users, count };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

const createUser = async (data) => {
  try {
    const { name, email, phone, status, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        status: status && status === "ACTIVE" ? true : false,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUser = async (id, data) => {
  try {
    const { name, email, role, phone, status, password } = data;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        phone,
        status: status && status === "ACTIVE" ? true : false,
        password: hashedPassword,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

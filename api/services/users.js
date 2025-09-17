const { PrismaClient } = require("@prisma/client");
const { createNotification } = require("./notification");
const prisma = new PrismaClient();

const getUsers = async (skip, take, filter, user) => {
  try {
    const params = {
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
    };

    if (skip) params.skip = (parseInt(skip) - 1) * (parseInt(take) || 0);
    if (take) params.take = parseInt(take);

    params.where = {};
    if (filter?.search) {
      params.where.name = {
        contains: filter.search,
      };
    }

    // Status filter (isActive)
    if (filter?.status !== undefined && filter?.status !== '') {
      params.where.isActive = filter.status === 'true';
    }

    // Role filter
    if (filter?.role) {
      params.where.role = filter.role;
    }

    // Manufacturer filter (only for MACSOFT users)
    if (filter?.manufacturer && 
        (user.role === "MACSOFT_ADMIN" || user.role === "MACSOFT_USER")) {
      params.where.customerId = filter.manufacturer;
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

    //include customer details in user object
    const usersWithCustomer = users.map((u) => {
      return {
        ...u,
        organisation: u.customer ? u.customer.name : "N/A",
      };
    });

    return { users: usersWithCustomer, count };
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

const createUser = async (userData, user) => {
  try {
    const newUser = await prisma.user.create({
      data: userData,
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    const notification = await createNotification({
      user: user,
      eventType: "crud",
      operation: "CREATE",
      title: "User Created",
      message: `User created - ${newUser.name} : ${newUser.email}`,
    });
    return newUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

const updateUser = async (id, userData, user) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    const notification = await createNotification({
      user: user,
      eventType: "crud",
      operation: "UPDATE",
      title: "User Updated",
      message: `User updated - ${updatedUser.name} : ${updatedUser.email}`,
    });
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user");
  }
};

const deleteUser = async (id, user) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    const notification = await createNotification({
      user: user,
      eventType: "crud",
      operation: "DELETE",
      title: "User Deleted",
      message: `User deleted - ${deletedUser.name} : ${deletedUser.email}`,
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

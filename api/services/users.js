// User service for authentication middleware
// You may need to implement these methods to connect to your user database/model

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

module.exports = {
  getUserByEmail,
  getUserById,
};

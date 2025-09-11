const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getNotificationById = async (id, notificationRecipient) => {
  try {
    //only need to select receipients for the user
    const notification = await prisma.notification.findUnique({
      where: { id: id },
    });
    notification.recipients = [notificationRecipient];
    return notification;
  } catch (error) {
    console.error("Error fetching notification by ID:", error);
    throw error;
  }
};

const getAllNotifications = async (skip, take, filter, userId) => {
  try {
    const params = {};
    if (userId) {
      params.include = {
        recipients: {
          where: {
            userId: userId,
          },
        },
      };
    }
    if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
    if (take) params.take = parseInt(take);

    if (filter) {
      params.where = {
        ...params.where,
        filter,
      };
    }

    const count = await prisma.notification.count({ where: params.where });

    const notifications = await prisma.notification.findMany(params);

    return { notifications, count };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

const NOTIFICATION_RULES = {
  CUSTOMER_USER: {
    login: ["MACSOFT_ADMIN", "MACSOFT_USER", "CUSTOMER_ADMIN"],
    crud: ["MACSOFT_ADMIN", "MACSOFT_USER", "CUSTOMER_ADMIN"],
  },
  CUSTOMER_ADMIN: {
    login: ["MACSOFT_ADMIN", "MACSOFT_USER"],
    crud: ["MACSOFT_ADMIN", "MACSOFT_USER", "CUSTOMER_USER"],
  },
  MACSOFT_USER: {
    login: ["MACSOFT_ADMIN"],
    crud: ["MACSOFT_ADMIN"],
  },
  MACSOFT_ADMIN: {
    crud: ["MACSOFT_USER"],
  },
};

const createNotification = async ({ user, eventType, title, message }) => {
  // 1. Determine recipient roles
  const userRole = user.role;
  const rule = NOTIFICATION_RULES[userRole] || {};
  const recipientRoles = rule[eventType] || [];

  if (recipientRoles.length === 0) return null;

  // 2. Find all users with those roles (excluding the actor)
  const recipients = await prisma.user.findMany({
    where: {
      role: { in: recipientRoles },
      id: { not: user.id },
      isActive: true,
    },
    select: { id: true },
  });

  if (recipients.length === 0) return null;

  const notification = await prisma.notification.create({
    data: {
      title,
      message,
      recipients: {
        create: recipients.map((u) => ({
          user: { connect: { id: u.id } },
        })),
      },
    },
    include: { recipients: true },
  });

  return notification;
};

const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const notificationRecipient = await prisma.notificationRecipient.update({
      where: {
        notificationId_userId: {
          notificationId: notificationId,
          userId: userId,
        },
      },
      data: { readAt: new Date() },
    });
    const notification = await getNotificationById(
      notificationId,
      notificationRecipient
    );
    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

module.exports = {
  getNotificationById,
  getAllNotifications,
  markNotificationAsRead,
  createNotification,
};

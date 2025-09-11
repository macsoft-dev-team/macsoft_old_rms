const notificationService = require("../services/notification");

const createNotification = async (req, res) => {
  try {
    const { eventType, title, message } = req.body;
    const user = req.user;
    const notification = await notificationService.createNotification({
      user,
      eventType,
      title,
      message,
    });

    if (!notification) {
      return res
        .status(404)
        .json({ message: "No recipients found for notification." });
    }

    return res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skip, take, filter } = req.query;

    const { notifications, count } =
      await notificationService.getAllNotifications(skip, take, filter, userId);
    return res.status(200).json({
      notifications,
      totalPages: Math.ceil(count / take),
      currentPage: parseInt(skip) || 1,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

 const markNotificationAsRead = async (req, res) => {
   const { id } = req.params;
    const userId = req.user.id;
   try {
     const updatedNotification = await notificationService.markNotificationAsRead(userId, id);
     if (!updatedNotification) {
       return res.status(404).json({ message: "Notification not found." });
     }
     return res.status(200).json(updatedNotification);
   } catch (error) {
     console.error("Error marking notification as read:", error);
     return res.status(500).json({ message: "Internal server error." });
   }
 };
module.exports = {
  createNotification,
  getAllNotifications,
  markNotificationAsRead,
};

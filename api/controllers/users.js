const userService = require("../services/users");
const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
const getUsers = async (req, res) => {
  const { skip, take, filter } = req.query;
  const user = req.user;
  try {
    const { users, count } = await userService.getUsers(
      skip,
      take,
      filter,
      user
    );
    res
      .status(200)
      .json({
        users,
        totalPages: Math.ceil(count / take),
        currentPage: parseInt(skip) || 1,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const userData = req.body;
  const user = req.user;

  try {
    if (user.role !== "MACSOFT_ADMIN" && user.role !== "MACSOFT_USER") {
      userData.customerId = user.customerId;
    }
    userData.password = await hashPassword(userData.password);
    const newUser = await userService.createUser(userData, user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const userData = req.body;
  try {
    if (user.role !== "MACSOFT_ADMIN" && user.role !== "MACSOFT_USER") {
      delete userData.customerId;
    }
    userData.password = await hashPassword(userData.password);
    const updatedUser = await userService.updateUser(id, userData, user);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await userService.deleteUser(id, user);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

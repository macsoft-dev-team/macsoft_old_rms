const commandService = require("../services/commands");

const getAllCommandsByDeviceId = async (req, res) => {
  const { skip, take, filter } = req.query;
  const deviceId = req.params.deviceId;

  try {
    const { commands, count } = await commandService.getAllCommandsByDeviceId(
      skip,
      take,
      filter,
      deviceId
    );
    res.status(200).json({
      commands,
      totalPages: Math.ceil(count / take),
      currentPage: parseInt(skip) || 1,
    });
  } catch (error) {
    console.error("Error fetching commands:", error);
    res.status(500).json({ error: "Could not fetch commands" });
  }
};

const createCommand = async (req, res) => {
  const data = req.body;
  const user = req.user;
  try {
    const command = await commandService.createCommand(data, user);
    res.status(201).json(command);
  } catch (error) {
    console.error("Error creating command:", error);
    res.status(500).json({ error: "Could not create command" });
  }
};

module.exports = {
  getAllCommandsByDeviceId,
  createCommand,
};

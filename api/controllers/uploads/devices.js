const devicesService = require("../../services/uploads/devices");

const uploadDevicesJSON = async (req, res) => {
  try {
    const devices = req.body;
    const user = req.user;
    if (!devices || !Array.isArray(devices) || devices.length === 0) {
      return res.status(400).json({
        error: "Invalid data format",
        message: "Expected an array of devices in request body",
      });
    }

    console.log(
      `Processing ${devices.length} pre-hashed devices from frontend`
    );

    // Since passwords are already hashed on frontend, we process all devices at once
    const result = await devicesService.uploadDevice(devices, user);

    if (!result) {
      return res.status(500).json({
        error: "Failed to upload devices",
        message: "Service returned no result",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully processed ${result.totalProcessed} devices`,
      data: result,
    });
  } catch (error) {
    console.error("Error in uploadDevicesJSON controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

module.exports = {
  uploadDevicesJSON,
};

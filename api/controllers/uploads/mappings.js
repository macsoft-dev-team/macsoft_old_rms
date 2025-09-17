const XLSX = require("xlsx");
const mappingService = require("../../services/uploads/mappings");
const uploadDevices = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        error: "Invalid data format",
        message: "Expected an array of devices in request body",
      });
    }

    if (data.length === 0) {
      return res
        .status(400)
        .json({ error: "No devices found in the uploaded file" });
    }

    // Get batch size from query parameter, default to 100
    const batchSize = parseInt(req.query.batchSize) || 100;

    // Validate batch size
    if (batchSize < 1 || batchSize > 1000) {
      return res.status(400).json({
        error: "Invalid batch size",
        message: "Batch size must be between 1 and 1000",
      });
    }

    console.log(
      `Processing ${data.length} devices with batch size: ${batchSize}`
    );

    const result = await mappingService.uploadDevice(data, batchSize, user);

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
    console.error("Error in uploadDevices controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

module.exports = {
  uploadDevices,
};

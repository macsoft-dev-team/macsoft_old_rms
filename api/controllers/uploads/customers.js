const XLSX = require("xlsx");
const customersService = require("../../services/uploads/customers");

const uploadCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const customersFromXL = XLSX.utils.sheet_to_json(worksheet);

    if (customersFromXL.length === 0) {
      return res
        .status(400)
        .json({ error: "No customers found in the uploaded file" });
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
      `Processing ${customersFromXL.length} customers with batch size: ${batchSize}`
    );

    const result = await customersService.uploadCustomer(customersFromXL, batchSize);

    if (!result) {
      return res.status(500).json({
        error: "Failed to upload customers",
        message: "Service returned no result",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully processed ${result.totalProcessed} customers`,
      data: result,
    });
  } catch (error) {
    console.error("Error in uploadCustomers controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

module.exports = {
  uploadCustomers,
};

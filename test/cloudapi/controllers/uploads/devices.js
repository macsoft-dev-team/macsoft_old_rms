const XLSX = require("xlsx");
const devicesService = require("../../services/uploads/devices");

// Validates a 15-digit IMEI using the Luhn algorithm
const isValidImei = (imei) => {
  const str = String(imei).trim();
  if (!/^\d{15}$/.test(str)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(str[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

const uploadDevices = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const devicesFromXL = XLSX.utils.sheet_to_json(worksheet);

    if (devicesFromXL.length === 0) {
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

    // Validate IMEI numbers before processing
    const invalidImeis = [];
    devicesFromXL.forEach((device, index) => {
      const imei = device.imeinumber;
      if (!imei || !isValidImei(imei)) {
        invalidImeis.push({
          row: index + 2, // +2: 1 for header row, 1 for 1-based index
          imeinumber: imei ?? '(empty)',
          reason: !imei
            ? 'Missing IMEI number'
            : !/^\d{15}$/.test(String(imei).trim())
            ? 'IMEI must be exactly 15 digits'
            : 'Failed Luhn checksum — invalid IMEI',
        });
      }
    });

    if (invalidImeis.length > 0) {
      return res.status(400).json({
        error: 'Invalid IMEI numbers found',
        message: `${invalidImeis.length} row(s) have invalid IMEI numbers. Please fix and re-upload.`,
        invalidImeis,
      });
    }

    console.log(
      `Processing ${devicesFromXL.length} devices with batch size: ${batchSize}`
    );

    const result = await devicesService.uploadDevice(devicesFromXL, batchSize);

    if (!result) {
      return res.status(500).json({
        error: "Failed to upload devices",
        message: "Service returned no result",
      });
    }

    return res.status(200).json({
      success: true,
      message: result.summary?.message || `Successfully processed ${result.totalProcessed} devices`,
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

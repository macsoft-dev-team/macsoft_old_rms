const dashboardService = require('../services/dashboard');

const getDashboardData = async (req, res) => {
  try {
    const user = req.user;
    const dashboardData = await dashboardService.getDashboardData(user);
    res.json(dashboardData);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardData,
};
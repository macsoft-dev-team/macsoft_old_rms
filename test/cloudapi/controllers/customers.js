const customerService = require("../services/customers");

const getAllCustomers = async (req, res) => {
  try {
    const { skip, take, filter } = req.query;
    const user = req.user;
    const { customers, count } = await customerService.getAllCustomers(skip, take, filter, user);
    res.status(200).json({
      customers,
      totalPages: Math.ceil(count / take),
      currentPage: parseInt(skip) || 1,
    });
  } catch (err) {
    if (err.status === 403) return res.status(403).json({ error: 'Unauthorized' });
    res.status(500).json({ error: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const user = req.user;
    const customer = await customerService.getCustomerById(req.params.id, user);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    if (err.status === 403) return res.status(403).json({ error: 'Unauthorized' });
    res.status(500).json({ error: err.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const user = req.user;
    const customer = await customerService.createCustomer(req.body, user);
    res.status(201).json(customer);
  } catch (err) {
    if (err.status === 403) return res.status(403).json({ error: 'Unauthorized' });
    res.status(500).json({ error: err.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const user = req.user;
    const customer = await customerService.updateCustomer(req.params.id, req.body, user);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    if (err.status === 403) return res.status(403).json({ error: 'Unauthorized' });
    res.status(500).json({ error: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const user = req.user;
    const result = await customerService.deleteCustomer(req.params.id, user);
    if (!result) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    if (err.status === 403) return res.status(403).json({ error: 'Unauthorized' });
    res.status(500).json({ error: err.message });
  }
};

const getCustomerDevices = async (req, res) => {
  try {
    const user = req.user;
    const devices = await customerService.getCustomerDevices(req.params.customerId, user);
    res.json(devices);
  } catch (err) {
    if (err.status === 403) return res.status(403).json({ error: 'Unauthorized' });
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerDevices,
};


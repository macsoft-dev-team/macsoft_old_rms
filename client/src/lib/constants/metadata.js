const deviceConfigData = {
  1: [
    {
      label: "Last Update",
      key: "2023-10-01 12:00:00",
      unit: "",
      className: "text-primary-emphasis",
    },
    { label: "Status", key: "Online", unit: "", className: "text-success" },
    {
      label: "Today Energy",
      key: "0.3 kWh",
      unit: "kWh",
      className: "text-primary-emphasis",
    },
    {
      label: "Total Energy",
      key: "4.4 kWh",
      unit: "kWh",
      className: "text-primary-emphasis",
    },
    {
      label: "PV Voltage",
      key: "416.4 V",
      unit: "V",
      className: "text-primary-emphasis",
    },
    {
      label: "PV Current",
      key: "0 A",
      unit: "A",
      className: "text-primary-emphasis",
    },
  ],
  2: [
    {
      label: "SSP-ID",
      key: "SSP-031939",
      unit: "",
      className: "text-primary-emphasis",
    },
    {
      label: "Device-ID",
      key: "username",
      unit: "",
      className: "text-primary-emphasis",
    },
    {
      label: "Today Water Output",
      key: "0.5 kL",
      unit: "kL",
      className: "text-primary-emphasis",
    },
    {
      label: "Total Water Output",
      key: "16.7 kL",
      unit: "kL",
      className: "text-primary-emphasis",
    },
    {
      label: "Motor Run Hours",
      key: "2.9 Hrs",
      unit: "Hrs",
      className: "text-primary-emphasis",
    },
    {
      label: "LPM",
      key: "0 Litre",
      unit: "Litre",
      className: "text-primary-emphasis",
    },
  ],
  3: [
    {
      label: "IMEI",
      key: "imeinumber",
      unit: "",
      className: "text-primary-emphasis",
    },
    {
      label: "Signal Strength",
      key: "67%",
      unit: "%",
      className: "text-primary-emphasis",
    },
    {
      label: "Co2 Emission Saved",
      key: "2 kg",
      unit: "kg",
      className: "text-primary-emphasis",
    },
    {
      label: "Tree Planted Equivalent",
      key: "0",
      unit: "",
      className: "text-primary-emphasis",
    },
    {
      label: "Fault",
      key: "No Fault",
      unit: "",
      className: "text-primary-emphasis",
    },
    {
      label: "Temperature",
      key: "--",
      unit: "°C",
      className: "text-primary-emphasis",
    },
  ],
};
const groupedDeviceStats = {
  "Device Information": [
    { label: "Device ID", key: "deviceId" },
    { label: "Host", key: "host" },
    { label: "IMEI Number", key: "imeinumber" },
    { label: "Password", key: "password" },
    { label: "Port", key: "port" },
    { label: "Pub Topic", key: "pubTopic" },
    { label: "Sub Topic", key: "subTopic" },
    { label: "Username", key: "username" },
  ],
  "Motor Information": [
    { label: "Motor", key: "password", unit: "KWh" },
    { label: "Motor", key: "password", unit: "KWh" },
    { label: "Motor", key: "password", unit: "KWh" },
    { label: "Motor", key: "password", unit: "KWh" },
  ],
  "Customer Information": [
    { label: "SSP-ID", key: "password" },
    { label: "Customer Name", key: "password" },
    { label: "Customer Address", key: "password" },
    { label: "Customer Phone", key: "password" },
  ],
};

const deviceInfoMeta = [
  { label: "Host", key: "host" },
  { label: "IMEI Number", key: "imeinumber" },
  { label: "Username", key: "username" },
  { label: "Password", key: "password" },
  { label: "Port", key: "port" },
  { label: "Pub Topic - Data", key: "pubTopicData" },
  { label: "Sub Topic - Cmd", key: "subTopicCmd" },
  { label: "Pub Topic - Cmd", key: "pubTopicCmd" },
];
const customerInfoMeta = [
  { label: "Customer Name", key: "name" },
  { label: "Customer Email", key: "email" },
  { label: "Customer Address", key: "address" },
  { label: "Customer Phone", key: "phone" },
];
const motorInfoMeta = [
  { label: "Motor", key: "motor" },
  { label: "Motor", key: "motor" },
  { label: "Motor", key: "motor" },
  { label: "Motor", key: "motor" },
];
export {
  deviceConfigData,
  groupedDeviceStats,
  deviceInfoMeta,
  customerInfoMeta,
  motorInfoMeta,
};

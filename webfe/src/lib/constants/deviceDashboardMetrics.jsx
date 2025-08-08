// Device dashboard metric card meta data
 
import { Sun, Plug, Activity, Zap, Gauge, Droplets, Thermometer, BatteryCharging, Clock } from 'lucide-react';
import {icons} from './icons';
export const deviceDashboardMetrics = [
  {
    icon: icons.solarPower,
    title: "PV Voltage",
    key: "inputVoltage",
    unit: "V DC",
    color: "yellow",
  },
  {
    icon: icons.spark,
    title: "Motor Voltage",
    key: "outputVoltage",
    unit: "V AC",
    color: "blue",
  },
  {
    icon: <Activity />, 
    title: "Motor Current",
    key: "outputCurrent",
    unit: "A",
    color: "purple",
  },
  {
    icon: icons.energizer,
    title: "Active Power",
    key: "outputPower",
    unit: "kW",
    color: "green",
  },
  {
    icon:  icons.cFan,
    title: "Motor Speed",
    key: "rpm",
    unit: "RPM",
    color: "red",
  },
  {
    icon: icons.waterWaves,
    title: "Flow",
    key: "flow",
    unit: "L/min",
    color: "blue",
  },
  {
    icon: <Thermometer  />,
    title: "Temperature",
    key: "temperature",
    unit: "°C",
    color: "orange",
  },
  {
    icon: <BatteryCharging />,
    title: "Today Energy Generated",
    key: "todayKWH",
    unit: "kWh",
    color: "green",
  },
  {
    icon: <Clock />,
    title: "Today Operation Hours Today",
    key: "todayHours",
    unit: "hrs",
    color: "purple",
  }
];


export const deviceMetricsGrouped = [

  {
    mainTitle: "Drive: Electrical Input",
    icon: icons.spark,
    pairs: [
      { label: "Input Voltage", unit: "V", key: "inputVoltage", icon: <BatteryCharging size={24} /> },
      { label: "Input Current", unit: "A", key: "inputCurrent", icon: <Activity size={24} /> },
    ],
  },
  {
    mainTitle: "Motor: Electrical Output",
    icon: icons.cFan,
    pairs: [
      { label: "Output Voltage", unit: "V", key: "outputVoltage", icon: <BatteryCharging size={24} /> },
      { label: "Output Current", unit: "A", key: "outputCurrent", icon: <Activity size={24} /> },
    ],
  },
  {
    mainTitle: "Today's Energy & Flow",
    icon: icons.waterWaves,
    pairs: [
      { label: "Energy", unit: "kWh", key: "todayKWH", icon: <Zap size={24} /> },
      { label: "Flow", unit: "L", key: "todayFlow", icon: <Droplets size={24} /> },
    ],
  },

  {
    mainTitle: "Drive: Power & Frequency",
    icon: icons.spark,
    pairs: [
      { label: "Input Power", unit: "W", key: "inputPower", icon: <Zap size={24} /> },
      { label: "Frequency", unit: "Hz", key: "frequency", icon: <Gauge size={24} /> },
    ],
  },
  {
    mainTitle: "Motor: Performance",
    icon: icons.rPm,
    pairs: [
      { label: "Output Power", unit: "W", key: "outputPower", icon: <Zap size={24} /> },
      { label: "Flow Rate", unit: "L/min", key: "flow", icon: <Droplets size={24} /> },
    ],
  },
  {
    mainTitle: "Total Energy & Flow",
    icon: icons.waterWaves,
    pairs: [
      { label: "Energy", unit: "kWh", key: "cumulativeKWH", icon: <Zap size={24} /> },
      { label: "Flow", unit: "L", key: "cumulativeFlow", icon: <Droplets size={24} /> },
    ],
  },
  {
    mainTitle: "Drive: Temperature",
    icon: icons.thermo,
    pairs: [
      { label: "Temperature", unit: "°C", key: "temperature", icon: <Thermometer size={24} /> },
    ],
  }, 
  {
    mainTitle: "Runtime",
    icon: icons.solarPower,
    pairs: [
      { label: "Today's Runtime", unit: "h", key: "todayHours", icon: <Clock size={24} /> },
      { label: "Total Runtime", unit: "h", key: "cumulativeHours", icon: <Clock size={24} /> },
    ],
  },
  {
    mainTitle: "Operations: Status",
    icon: icons.settings,
    pairs: [
      { label: "Fault Code", unit: "", key: "faultCode", icon: <Gauge size={24} /> },
      { label: "Status", unit: "", key: "status", icon: <Gauge size={24} /> },
    ],
  },

];

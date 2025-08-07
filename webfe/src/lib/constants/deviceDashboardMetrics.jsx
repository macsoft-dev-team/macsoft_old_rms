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

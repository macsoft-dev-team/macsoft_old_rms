// Device dashboard metric card meta data
 
import { Sun, Plug, Activity, Zap, Gauge, Droplets, Thermometer, BatteryCharging, Clock } from 'lucide-react';

export const deviceDashboardMetrics = [
  {
    icon: <Sun />,
    title: "Solar PV Voltage",
    key: "pvDcVoltage",
    unit: "V DC",
    color: "yellow",
  },
  {
    icon: <Plug />,
    title: "Motor Input Voltage",
    key: "outputMotorVoltage",
    unit: "V AC",
    color: "blue",
  },
  {
    icon: <Activity />, 
    title: "Motor Current Draw",
    key: "outputMotorCurrent",
    unit: "A",
    color: "purple",
  },
  {
    icon: <Zap />, 
    title: "Motor Power Output",
    key: "outputMotorPower",
    unit: "kW",
    color: "green",
  },
  {
    icon: <Gauge />,
    title: "Motor Speed",
    key: "rpm",
    unit: "RPM",
    color: "red",
  },
  {
    icon: <Droplets />,  
    title: "Water Flow Rate",
    key: "flowSpeed",
    unit: "L/min",
    color: "blue",
  },
  {
    icon: <Thermometer  />,
    title: "Motor Temperature",
    key: "temperature",
    unit: "°C",
    color: "orange",
  },
  {
    icon: <BatteryCharging />,
    title: "Daily Energy Generated",
    key: "todayEnergy",
    unit: "kWh",
    color: "green",
  },
  {
    icon: <Clock />,
    title: "Operating Hours Today",
    key: "todayRunHours",
    unit: "hrs",
    color: "purple",
  },
];

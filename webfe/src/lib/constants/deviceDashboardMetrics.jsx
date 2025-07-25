// Device dashboard metric card meta data
// Each object describes a metric card for the dashboard

import { 
  SolarPVMeter, 
  MotorAmmeter, 
  WaterPumpFlow, 
  IndustrialThermometer,
  SolarEnergyBattery,
  RelevantMotor
} from '../../components/device/RelevantAnimatedIcons';
import { Clock } from 'lucide-react';

export const deviceDashboardMetrics = [
  {
    icon: <SolarPVMeter  />,
    title: "Solar PV Voltage",
    key: "pvDcVoltage",
    unit: "V DC",
    color: "yellow",
  },
  {
    icon: <SolarPVMeter  />,
    title: "Motor Input Voltage",
    key: "outputMotorVoltage",
    unit: "V AC",
    color: "blue",
  },
  {
    icon: <MotorAmmeter />,
    title: "Motor Current Draw",
    key: "outputMotorCurrent",
    unit: "A",
    color: "purple",
  },
  {
    icon: <SolarEnergyBattery />,
    title: "Motor Power Output",
    key: "outputMotorPower",
    unit: "kW",
    color: "green",
  },
  {
    icon: <RelevantMotor   />,
    title: "Motor Speed",
    key: "rpm",
    unit: "RPM",
    color: "red",
  },
  {
    icon: <WaterPumpFlow />,  
    title: "Water Flow Rate",
    key: "flowSpeed",
    unit: "L/min",
    color: "blue",
  },
  {
    icon: <IndustrialThermometer  />,
    title: "Motor Temperature",
    key: "temperature",
    unit: "°C",
    color: "orange",
  },
  {
    icon: <SolarEnergyBattery />,
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

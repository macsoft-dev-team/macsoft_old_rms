export const WaterPumpFlow = ({ flowRate, isRunning }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">Water Pump</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <ellipse cx="20" cy="20" rx="15" ry="8" fill={isRunning ? "#22d3ee" : "#374151"} />
      <text x="20" y="25" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{flowRate} L/m</text>
    </svg>
  </div>
);
export const SolarPVMeter = ({ voltage }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">PV Meter</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="10" y="18" width="20" height="8" fill="#fde68a" />
      <rect x="10" y="10" width="20" height="8" fill="#fbbf24" />
      <text x="20" y="35" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{voltage}V</text>
    </svg>
  </div>
);
export const Enhanced3DMotor = ({ rpm, isRunning }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">3D Motor</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15" fill={isRunning ? "#60a5fa" : "#374151"} />
      <text x="20" y="25" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{rpm} RPM</text>
    </svg>
  </div>
);
export const MotorAmmeter = ({ current }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">Ammeter</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="15" y="10" width="10" height="20" fill="#a78bfa" />
      <text x="20" y="25" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{current}A</text>
    </svg>
  </div>
);
import React from "react";

export const IndustrialThermometer = ({ temperature }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">Thermometer</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="18" y="10" width="4" height="18" fill="#f87171" />
      <circle cx="20" cy="32" r="6" fill="#f87171" />
      <text x="20" y="25" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{temperature}°C</text>
    </svg>
  </div>
);

export const SolarEnergyBattery = ({ energy, isCharging }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">Solar Battery</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="10" y="12" width="20" height="16" fill="#34d399" stroke="#065f46" strokeWidth="2" />
      <rect x="15" y="16" width="10" height={Math.max(4, Math.min(12, energy / 10))} fill={isCharging ? "#fbbf24" : "#374151"} />
      <text x="20" y="35" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{energy}%</text>
    </svg>
  </div>
);

export const RelevantMotor = ({ rpm, isRunning }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">Relevant Motor</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15" fill={isRunning ? "#f472b6" : "#374151"} />
      <text x="20" y="25" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{rpm} RPM</text>
    </svg>
  </div>
);
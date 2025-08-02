import React from "react";

export const Enhanced3DVoltage = ({ voltage }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">3D Voltage</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="10" y="10" width="20" height="20" fill="#fbbf24" />
      <text x="20" y="25" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{voltage}V</text>
    </svg>
  </div>
);

export const Enhanced3DMotor = ({ rpm, isRunning }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">3D Motor</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15" fill={isRunning ? "#60a5fa" : "#d1d5db"} />
      <text x="20" y="25" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{rpm} RPM</text>
    </svg>
  </div>
);

export const Enhanced3DWaterFlow = ({ flowSpeed, isRunning }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">3D Water Flow</span>
    <svg width="40" height="40" viewBox="0 0 40 40">
      <ellipse cx="20" cy="20" rx="15" ry="8" fill={isRunning ? "#22d3ee" : "#d1d5db"} />
      <text x="20" y="25" textAnchor="middle" fontSize="12" fill="currentColor" className="text-gray-800 dark:text-gray-100">{flowSpeed} L/m</text>
    </svg>
  </div>
);

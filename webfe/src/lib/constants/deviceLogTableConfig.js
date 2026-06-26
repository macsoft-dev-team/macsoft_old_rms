// Device Log Table Configuration
export const deviceLogTableConfig = {
  sections: [
    {
      id: 'drive',
      name: 'Drive Parameters',
      color: 'blue',
      icon: '🔌',
      columns: [
        { key: 'inputVoltage', label: 'Input Voltage', unit: 'V', width: 'min-w-[80px]' },
        { key: 'inputCurrent', label: 'Input Current', unit: 'A', width: 'min-w-[80px]' },
        { key: 'inputPower', label: 'Input Power', unit: 'W', width: 'min-w-[80px]' },
        { key: 'frequency', label: 'Frequency', unit: 'Hz', width: 'min-w-[90px]' },
        { key: 'temperature', label: 'Temperature', unit: '°C', width: 'min-w-[100px]' }
      ]
    },
    {
      id: 'motor',
      name: 'Motor & Operations',
      color: 'emerald',
      icon: '⚙️',
      columns: [
        { key: 'outputVoltage', label: 'Output Voltage', unit: 'V', width: 'min-w-[80px]' },
        { key: 'outputCurrent', label: 'Output Current', unit: 'A', width: 'min-w-[80px]' },
        { key: 'outputPower', label: 'Output Power', unit: 'W', width: 'min-w-[80px]' },
        { key: 'faultCode', label: 'Fault Code', unit: '', width: 'min-w-[90px]' },
        { key: 'status', label: 'Status', unit: '', width: 'min-w-[80px]' },
        { key: 'flow', label: 'Flow Rate', unit: 'L/min', width: 'min-w-[80px]' }
      ]
    },
    {
      id: 'today',
      name: "Today's Data",
      color: 'orange',
      icon: '📅',
      columns: [
        { key: 'todayKWH', label: 'Energy', unit: 'kWh', width: 'min-w-[80px]' },
        { key: 'todayFlow', label: 'Flow', unit: 'L', width: 'min-w-[80px]' },
        { key: 'todayHours', label: 'Runtime', unit: 'h', width: 'min-w-[80px]' }
      ]
    },
    {
      id: 'total',
      name: 'Total Data',
      color: 'purple',
      icon: '📊',
      columns: [
        { key: 'cumulativeKWH', label: 'Energy', unit: 'kWh', width: 'min-w-[80px]' },
        { key: 'cumulativeFlow', label: 'Flow', unit: 'L', width: 'min-w-[80px]' },
        { key: 'cumulativeHours', label: 'Runtime', unit: 'h', width: 'min-w-[80px]' }
      ]
    }
  ],
  fixedColumns: [
    { key: 'sno', label: 'S.No', width: 'min-w-[60px]', sticky: true },
    { key: 'timestamp', label: 'Timestamp', description: 'DD-MM-YYYY HH:mm', width: 'min-w-[140px]', sticky: true }
  ],
  additionalColumns: [
    { key: 'signalStrength', label: 'Signal', description: 'Strength (%)', width: 'min-w-[100px]' }
  ]
};

export const getColorConfig = (color) => {
  const configs = {
    blue: {
      accent: 'bg-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      bgLight: 'bg-blue-50/50 dark:bg-blue-900/20',
      bgRow: 'bg-blue-50/30 dark:bg-blue-900/10',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500'
    },
    emerald: {
      accent: 'bg-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      bgLight: 'bg-emerald-50/50 dark:bg-emerald-900/20',
      bgRow: 'bg-emerald-50/30 dark:bg-emerald-900/10',
      border: 'border-emerald-200 dark:border-emerald-700',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500'
    },
    orange: {
      accent: 'bg-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      bgLight: 'bg-orange-50/50 dark:bg-orange-900/20',
      bgRow: 'bg-orange-50/30 dark:bg-orange-900/10',
      border: 'border-orange-200 dark:border-orange-700',
      text: 'text-orange-700 dark:text-orange-300',
      dot: 'bg-orange-500'
    },
    purple: {
      accent: 'bg-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      bgLight: 'bg-purple-50/50 dark:bg-purple-900/20',
      bgRow: 'bg-purple-50/30 dark:bg-purple-900/10',
      border: 'border-purple-200 dark:border-purple-700',
      text: 'text-purple-700 dark:text-purple-300',
      dot: 'bg-purple-500'
    }
  };
  return configs[color] || configs.blue;
};

export const getTotalColumns = () => {
  return deviceLogTableConfig.fixedColumns.length + 
         deviceLogTableConfig.sections.reduce((total, section) => total + section.columns.length, 0) +
         deviceLogTableConfig.additionalColumns.length;
};

export const getAllColumns = () => {
  const allColumns = [
    ...deviceLogTableConfig.fixedColumns,
    ...deviceLogTableConfig.sections.flatMap(section => section.columns),
    ...deviceLogTableConfig.additionalColumns
  ];
  return allColumns;
};

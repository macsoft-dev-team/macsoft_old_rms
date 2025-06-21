import { FaTachometerAlt, FaMicrochip, FaExclamationTriangle, FaClipboardList, FaFileAlt, FaUsers } from 'react-icons/fa'
export const navData = [
  {
    title: 'Dashboard',
    icon: <FaTachometerAlt />,
    url: '/dashboard',
  },
  {
    title: 'SSP Devices',
    icon: <FaMicrochip />,
    url: '/devices',
  },
  {
    title: 'Faults',
    icon: <FaExclamationTriangle />,
    url: '/faults',
  },
  {
    title: 'Templates',
    icon: <FaFileAlt />,
    url: '/templates',
  },
  {
    title: 'Customers',
    icon: <FaUsers />,
    url: '/customers',
  },
];


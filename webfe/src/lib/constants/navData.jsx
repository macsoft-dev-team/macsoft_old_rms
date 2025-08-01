import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    Activity,
    AlertTriangle, 
    Monitor,
    Package,
    UserCheck,
    Server,
  } from 'lucide-react';

export const menuItems = [
    {
        path: '/',
        icon: LayoutDashboard,
        label: 'Dashboard',
        category: 'main',
    },
    {
        path: '/devices',
        icon: Monitor,
        label: 'Devices',
        category: 'main',
    },
  /*   {
        path: '/device-logs',
        icon: Activity,
        label: 'Device Logs',
        category: 'main',
    },
    {
        path: '/faults',
        icon: AlertTriangle,
        label: 'Faults',
        category: 'main',
    }, */
    {
        path: '/manufacturers',
        icon: Users,
        label: 'Manufacturers',
        category: 'management',
    },
    {
        path: '/users',
        icon: UserCheck,
        label: 'Users',
        category: 'management',
    },
    {
        path: '/templates/modbus',
        icon: FileText,
        label: 'Modbus Templates',
        category: 'main',
    },
    {
        path: '/templates/server',
        icon: FileText,
        label: 'Server Templates',
        category: 'main',
    },
    {
        path: '/commands',
        icon: Server,
        label: 'MQTT Commands',
        category: 'main',
    }, 
    {
        path: '/settings',
        icon: Settings,
        label: 'Settings',
        category: 'system',
    },
];

export const MACSOFT_ADMIN_MENU_ITEMS = [
    {
        path: '/',
        icon: LayoutDashboard,
        label: 'Dashboard',
        category: 'main',
    },
    {
        path: '/devices',
        icon: Monitor,
        label: 'Devices',
        category: 'main',
    },
    /*   {
          path: '/device-logs',
          icon: Activity,
          label: 'Device Logs',
          category: 'main',
      },
      {
          path: '/faults',
          icon: AlertTriangle,
          label: 'Faults',
          category: 'main',
      }, */
    {
        path: '/manufacturers',
        icon: Users,
        label: 'Manufacturers',
        category: 'management',
    },
    {
        path: '/users',
        icon: UserCheck,
        label: 'Users',
        category: 'management',
    },
    {
        path: '/templates/modbus',
        icon: FileText,
        label: 'Modbus Templates',
        category: 'main',
    },
    {
        path: '/templates/server',
        icon: FileText,
        label: 'Server Templates',
        category: 'main',
    },
    {
        path: '/commands',
        icon: Server,
        label: 'MQTT Commands',
        category: 'main',
    },
    {
        path: '/settings',
        icon: Settings,
        label: 'Settings',
        category: 'system',
    },
];
export const MACSOFT_USER_MENU_ITEMS = [
    {
        path: '/',
        icon: LayoutDashboard,
        label: 'Dashboard',
        category: 'main',
    },
    {
        path: '/devices',
        icon: Monitor,
        label: 'Devices',
        category: 'main',
    },  
    {
        path: '/templates/modbus',
        icon: FileText,
        label: 'Modbus Templates',
        category: 'main',
    },
    {
        path: '/templates/server',
        icon: FileText,
        label: 'Server Templates',
        category: 'main',
    },
    {
        path: '/commands',
        icon: Server,
        label: 'MQTT Commands',
        category: 'main',
    },
    {
        path: '/settings',
        icon: Settings,
        label: 'Settings',
        category: 'system',
    },
];

export const CUSTOMER_ADMIN_MENU_ITEMS = [
    {
        path: '/',
        icon: LayoutDashboard,
        label: 'Dashboard',
        category: 'main',
    },  
    {
        path: '/devices',
        icon: Monitor,
        label: 'Devices',
        category: 'main',
    },  
    {
        path: '/users',
        icon: UserCheck,
        label: 'Users',
        category: 'management',
    },
    {
        path: '/templates/modbus',
        icon: FileText,
        label: 'Modbus Templates',
        category: 'main',
    },
    {
        path: '/templates/server',
        icon: FileText,
        label: 'Server Templates',
        category: 'main',
    },
    {
        path: '/commands',
        icon: Server,
        label: 'MQTT Commands',
        category: 'main',
    },
    {
        path: '/settings',
        icon: Settings,
        label: 'Settings',
        category: 'system',
    },
];
export const CUSTOMER_USER_MENU_ITEMS = [
    {
        path: '/',
        icon: LayoutDashboard,
        label: 'Dashboard',
        category: 'main',
    },
    {
        path: '/devices',
        icon: Monitor,
        label: 'Devices',
        category: 'main',
    }, 
    {
        path: '/templates/modbus',
        icon: FileText,
        label: 'Modbus Templates',
        category: 'main',
    },
    {
        path: '/templates/server',
        icon: FileText,
        label: 'Server Templates',
        category: 'main',
    },
    {
        path: '/commands',
        icon: Server,
        label: 'MQTT Commands',
        category: 'main',
    },
    {
        path: '/settings',
        icon: Settings,
        label: 'Settings',
        category: 'system',
    },
];

export const END_USER_MENU_ITEMS = [
    {
        path: '/devices/deviceId',
        icon: Monitor,
        label: 'Devices',
        category: 'main',
    },
];

export const switchMenuItems = (role) => {
    switch (role) {
        case 'MACSOFT_ADMIN':
            return MACSOFT_ADMIN_MENU_ITEMS;
        case 'MACSOFT_USER':
            return MACSOFT_USER_MENU_ITEMS;
        case 'CUSTOMER_ADMIN':
            return CUSTOMER_ADMIN_MENU_ITEMS;
        case 'CUSTOMER_USER':
            return CUSTOMER_USER_MENU_ITEMS;
        default:
            return END_USER_MENU_ITEMS;
    }
}
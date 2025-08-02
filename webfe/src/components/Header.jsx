import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
 
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { toggleSidebar, setNotification } from '../lib/features/uiSlice';
import { logout } from '../lib/features/authSlice';
import { useTheme } from '../hooks/useTheme';
import { NavLink } from 'react-router-dom';
import Input from './ui/input';
import Overlay from './Overlay';
import { Button } from './ui/button';

const Header = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const { theme, setTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountDialog, setShowAccountDialog] = useState(false);

  // Form state for account settings
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'Device Alert',
      message: 'Device MAC-001 has reported a fault',
      time: '2 minutes ago',
      unread: true,
      type: 'warning',
    },
    {
      id: 2,
      title: 'System Update',
      message: 'Maintenance scheduled for tonight',
      time: '1 hour ago',
      unread: true,
      type: 'info',
    },
    {
      id: 3,
      title: 'New User',
      message: 'John Doe has been added to the system',
      time: '3 hours ago',
      unread: false,
      type: 'success',
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
  };

  const handleSidebarToggle = () => {
    console.log('Header toggle clicked, current state:', sidebarCollapsed);
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(setNotification({
        type: 'info',
        message: `Searching for: ${searchQuery}`,
      }));
      // Implement search functionality here
      setSearchQuery('');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountUpdate = (e) => {
    e.preventDefault();
    // Add validation and dispatch update logic here
    // For now, just close dialog
    setShowAccountDialog(false);
    // Optionally show notification
    dispatch(setNotification({
      type: 'success',
      message: 'Account updated successfully!',
    }));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 dark:bg-gray-900 dark:border-gray-700 ${
        sidebarCollapsed ? 'md:left-16' : 'md:left-64'
      } left-0`}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSidebarToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 active:scale-95"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors" />
          </button>

          {/* Search Bar 
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center">
              <Search className="absolute left-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search devices, logs, customers..."
                className="pl-10 pr-4 py-2 w-64 lg:w-80 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </form>*/}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon size={16} className=" text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun size={16} className=" text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer dark:border-gray-600 dark:hover:bg-gray-700 ${
                          notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-600">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div> 
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center dark:bg-gray-600">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowAccountDialog(true);
                      setShowUserMenu(false);
                    }}
                  >
                    <UserCheck className="w-4 h-4 mr-3" />
                    Account Settings
                  </button>
                  <NavLink to="/settings"  >
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4 mr-3" />
                      Preferences
                    </button>
                  </NavLink>
                </div>
                <div className="border-t border-gray-200 py-2 dark:border-gray-600">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Settings Dialog */}
      <div  >
        {showAccountDialog && (
          <Overlay  open={showAccountDialog} onClose={() => setShowAccountDialog(false)} title="Account Settings">
            <form onSubmit={handleAccountUpdate}>
              <div className="space-y-4">
                <Input
                  label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleFormChange}
                    />
                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                    />
                  </div>
              <Button
                       type="submit"
                      className="px-4 my-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    >
                      Save Changes
                    </Button>

                </form>
             
          </Overlay>
        )}
      </div>
    </header>
  );
};

export default Header;

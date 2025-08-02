import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { toggleSidebar, setSidebarCollapsed } from '../lib/features/uiSlice';
import { logout } from '../lib/features/authSlice';
import logo from '../assets/macsoft-logo.png';
import { switchMenuItems } from '../lib/constants/routes';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarCollapsed, isMobile } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebarCollapsed(true));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      const menuItems = switchMenuItems(user.role) || [];
      setMenuItems(menuItems);
    }
  }, [user]);
  const handleToggle = () => {
    console.log('Toggle button clicked, current state:', sidebarCollapsed);
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center px-3 py-2.5 mx-0 md:mx-2 rounded-lg transition-all duration-200 group ${isActive
          ? 'bg-blue-600 text-white shadow-lg dark:bg-blue-200/10'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
          }`}
      >
        <Icon
          className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'
            } transition-colors`}
        />
        {!sidebarCollapsed && (
          <span className="font-medium truncate">{item.label}</span>
        )}
      </Link>
    );
  };

  const renderCategory = (category, items) => {
    if (sidebarCollapsed) {
      return items.map(renderMenuItem);
    }

    const categoryTitles = {
      main: 'Main',
      management: 'Management',
      system: 'System',
    };

    return (
      <div key={category} className="mb-6">
        <div className="px-3 mb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            {categoryTitles[category]}
          </h3>
        </div>
        <div className="space-y-1">
          {items.map(renderMenuItem)}
        </div>
      </div>
    );
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden dark:bg-black dark:bg-opacity-60"
          onClick={() => dispatch(setSidebarCollapsed(true))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 shadow-lg dark:bg-gray-900 dark:border-gray-700 ${sidebarCollapsed ? 'w-16' : 'w-64'
          } ${isMobile && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-8  rounded-lg flex items-center justify-center dark:bg-blue-500">
                <img src={logo} alt="MacSoft Logo" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">MacSoft RMS</h1>
            </div>
          )}
          <button
            onClick={handleToggle}
            className="p-1 min-w-5 min-h-8 max-h-8 rounded-lg group/logo hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 active:scale-95"
          >
            {sidebarCollapsed ? (
              <div>
                <img className='group-hover/logo:hidden' src={logo} alt="MacSoft Logo" />
                <div className="hidden group-hover/logo:block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  <ChevronRight className=" w-full h-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors" />
                </div>

              </div>
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {Object.entries(groupedItems).map(([category, items]) =>
            renderCategory(category, items)
          )}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          {!sidebarCollapsed && user && (
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center dark:bg-gray-600">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                  {user.email || 'user@example.com'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-1 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 ${sidebarCollapsed ? 'justify-center' : ''
              }`}
          >
            <LogOut className={`${sidebarCollapsed ? 'lg:min-w-[20px] lg:min-h-[20px] w-5 h-5 ' : 'mr-3 w-5 h-5 '}`} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

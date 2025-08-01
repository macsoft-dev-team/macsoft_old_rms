import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';
import { setIsMobile } from '../lib/features/uiSlice';
import { ToastProvider } from '../components/ui/toast';

const Layout = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed, isMobile, theme } = useSelector((state) => state.ui);

  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && !sidebarCollapsed && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-40 transition-opacity duration-300"
            onClick={() => dispatch({ type: 'ui/toggleSidebar' })}
          />
        )}
        {/* Sidebar overlays on mobile, collapses on desktop */}
        <div
          className={`fixed top-0 left-0 h-full z-30 transition-all duration-300
            ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'}
            ${isMobile ? (sidebarCollapsed ? 'w-0' : 'w-64') : 'w-0 md:block'}
            bg-white dark:bg-gray-800
          `}
          style={{ display: isMobile ? (sidebarCollapsed ? 'none' : 'block') : undefined }}
        >
          <Sidebar />
        </div>
        <Header />
        <main
          className={`transition-all duration-300 pt-20 p-5
            ${isMobile ? '' : sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
          `}
        >
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
        <Notification />
        <LoadingSpinner />
      </div>
    </ToastProvider>
  );
};

export default Layout;

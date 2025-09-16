import { useState, useEffect } from 'react';
import TitleHead from '../../components/TitleHead';
import { Button } from '../../components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotification } from '../../hooks/useNotifications';
import ReusableTable from '../../components/ui/reusableTable';
import NotificationFormDialog from './components/NotificationFormDialog';

export default function Notifications() {
  const { 
    notifications, 
    notification, 
    setNotification, 
    currentPage, 
    totalPages, 
    filter, 
    mode, 
    loading,
    fetchNotifications, 
    updateNotification,
    setMode, 
    onPageChange 
  } = useNotification();

  const handleViewNotification = (notificationData) => {
    setNotification(notificationData);
    setMode({ ...mode, view: true });
  };

  const handleViewClose = () => {
    setMode({ ...mode, view: false });
    setNotification(null);
  };

  const handleMarkAsRead = (notificationData) => {
    updateNotification({
      notificationId: notificationData.id,
      isRead: true
    });
  };

  const handleMarkAllAsRead = () => {
    // Mark all unread notifications as read
    notifications
      .filter(n => !n.isRead)
      .forEach(n => {
        updateNotification({
          notificationId: n.id,
          isRead: true
        });
      });
  };

  const columns = [
    { key: 'title', label: 'Title', align: 'left' },
    { key: 'message', label: 'Message', align: 'left' },
    { key: 'type', label: 'Type', align: 'left' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'createdAt', label: 'Created At', align: 'left', dataType: 'date' },
  ];

  const tableData = notifications.map(n => ({ 
    ...n, 
    status: n.isRead ? 
      <div className='text-green-500 flex items-center gap-1'>
        <CheckCheck className='w-4 h-4' />
        Read
      </div> : 
      <div className='text-orange-500 flex items-center gap-1'>
        <Bell className='w-4 h-4' />
        Unread
      </div> 
  }));

  useEffect(() => {
    fetchNotifications({ skip: currentPage, take: 10, filter: filter });
  }, [fetchNotifications, filter]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <TitleHead title="Notifications" description="View and manage your notifications here.">
        <div className='flex items-center gap-2'>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              className="text-base dark:bg-orange-900 dark:text-orange-100"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="w-5 h-5 mr-2" />
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>

        <NotificationFormDialog
          open={mode.view}
          onOpenChange={open => setMode({ ...mode, view: open })}
          notification={notification}
          mode="view"
          onCancel={handleViewClose}
          onMarkAsRead={handleMarkAsRead}
        />
      </TitleHead>
      
      <ReusableTable
        columns={columns}
        data={tableData}
        headerColor="bg-gray-100 dark:bg-blue-900"
        headerTextColor="text-gray-700 dark:text-gray-200"
        size="sm"
        onView={handleViewNotification}
        SNo={false}
        currentPage={currentPage}
        pageSize={totalPages}
        bordered
        onPageChange={onPageChange}
        loading={loading}
      />
    </div>
  );
}
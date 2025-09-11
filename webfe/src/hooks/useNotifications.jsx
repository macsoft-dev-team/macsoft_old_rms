
import {
    fetchNotifications,
    fetchNotificationById,
    createNotification,
    updateNotification,   
    setNotification,
    setFilter,
    setMode,
} from "../lib/features/notifications";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

export const useNotification = () => {
    const dispatch = useDispatch();
    const {
        notifications,
        notification,
        currentPage,
        totalPages,
        filter,
        mode,
        loading,
    } = useSelector((state) => state.notification);

    const onPageChange = useCallback(
        (skip) => {
            dispatch(fetchNotifications({ skip, take: 10, filter }));
        },
        [dispatch, filter]
    );

    const setNotificationCallback = useCallback(
        (notification) => dispatch(setNotification(notification)),
        [dispatch]
    );

    const fetchNotificationsCallback = useCallback(
        (params) => dispatch(fetchNotifications(params)),
        [dispatch]
    );

    const fetchNotificationByIdCallback = useCallback(
        (id) => dispatch(fetchNotificationById(id)),
        [dispatch]
    );

    const updateNotificationCallback = useCallback(
        (payload) => dispatch(updateNotification({ notificationId: payload.notificationId, data: payload })),
        [dispatch]
    );

 
    const setFilterCallback = useCallback(
        (filter) => dispatch(setFilter(filter)),
        [dispatch]
    );

    const setModeCallback = useCallback(
        (mode) => dispatch(setMode(mode)),
        [dispatch]
    );
    const createNotificationCallback = useCallback(
        (data) => dispatch(createNotification(data)),
        [dispatch]
    );
    return {
        notifications,
        notification,
        currentPage,
        totalPages,
        filter,
        loading,
        mode,
        setNotification: setNotificationCallback,
        fetchNotifications: fetchNotificationsCallback,
        fetchNotificationById: fetchNotificationByIdCallback,
        updateNotification: updateNotificationCallback,
        createNotification: createNotificationCallback,
        setFilter: setFilterCallback,
        onPageChange,
        setMode: setModeCallback,
    };
};

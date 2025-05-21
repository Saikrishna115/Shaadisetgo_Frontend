import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';
import { hideNotification } from '../../store/slices/notificationSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);

  const handleClose = (id) => {
    dispatch(hideNotification(id));
  };

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration) {
        setTimeout(() => {
          dispatch(hideNotification(notification.id));
        }, notification.duration);
      }
    });
  }, [notifications, dispatch]);

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: notifications.indexOf(notification) * 8 }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            elevation={6}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Notification; 
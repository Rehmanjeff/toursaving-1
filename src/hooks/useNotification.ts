import { useState } from 'react';

type notificationType = 'success' | 'error';

export function useNotification() {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as notificationType,
  });

  const showNotification = (message: string, type : notificationType) => {
    setNotification({
      show: true,
      message,
      type: type || 'success',
    });
  };

  const hideNotification = () => {
    setNotification({
      ...notification,
      show: false,
    });
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
}
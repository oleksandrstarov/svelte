import { writable } from 'svelte/store';

function defineNotificationStore() {
  const { subscribe, update, set } = writable({ notifications: [] });

  const closeNotification = id => {
    update(prevState => {
      const notificationIndex = prevState.notifications.findIndex(
        notification => notification.id === id,
      );
      if (notificationIndex !== -1) {
        const notification = prevState.notifications[notificationIndex];

        clearTimeout(notification.timeoutRef);

        prevState.notifications.splice(notificationIndex, 1);
      }

      return { ...prevState };
    });
  };

  const addNotification = ({ type, message, timeout } = {}) => {
    update(prevState => {
      const notification = {
        id: prevState.notifications.length
          ? prevState.notifications[prevState.notifications.length - 1].id + 1
          : 0,
        message: message || 'Something went wrong',
        timeout: timeout || 3000,
        count: 1,
        timeoutRef: null,
        ...getNotificationStyle(type),
      };

      notification.timeoutRef = setTimeout(() => {
        closeNotification(notification.id);
      }, notification.timeout);

      const existingNotification = prevState.notifications.findIndex(
        item => item.message === message,
      );

      if (existingNotification !== -1) {
        notification.count = prevState.notifications[existingNotification].count + 1;
        notification.id = prevState.notifications[existingNotification].id;
        clearTimeout(prevState.notifications[existingNotification].timeoutRef);

        const notificationsCopy = [...prevState.notifications];
        notificationsCopy.splice(existingNotification, 1, notification);

        return {
          ...prevState,
          notifications: [...notificationsCopy],
        };
      }

      return {
        ...prevState,
        notifications: [...prevState.notifications, notification],
      };
    });
  };

  return {
    set,
    subscribe,
    addNotification,
    closeNotification,
  };
}
const getNotificationStyle = type => {
  switch (type) {
    case NOTIFICATION_TYPE.Info:
      return { icon: 'info', color: 'blue' };
    case NOTIFICATION_TYPE.Positive:
      return { icon: 'check_circle', color: 'green' };
    case NOTIFICATION_TYPE.Warning:
      return { icon: 'warning', color: 'yellow' };
    default:
      return { icon: 'error', color: 'red' };
  }
};

export const NOTIFICATION_TYPE = {
  Info: 'info',
  Positive: 'positive',
  Warning: 'warning',
  Error: 'error',
};

export const notificationsStore = defineNotificationStore();

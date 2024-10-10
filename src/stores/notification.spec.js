import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { NOTIFICATION_TYPE, notificationsStore } from './notification';

describe('notificationsStore', () => {
  let unsubscribe;

  beforeEach(() => {
    vi.useFakeTimers();
    notificationsStore.set({ notifications: [] });
    unsubscribe = notificationsStore.subscribe(() => {});
  });

  afterEach(() => {
    unsubscribe();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should start with an empty notifications array', () => {
    let notifications;
    notificationsStore.subscribe(value => {
      notifications = value.notifications;
    })();
    expect(notifications).toEqual([]);
  });

  it('should add positive notification', () => {
    notificationsStore.addNotification({
      message: 'Positive Notification',
      type: NOTIFICATION_TYPE.Positive,
    });

    let notifications;
    notificationsStore.subscribe(value => {
      notifications = value.notifications;
    })();

    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toBe('Positive Notification');
    expect(notifications[0].count).toBe(1);
    expect(notifications[0].icon).toBe('check_circle');
    expect(notifications[0].color).toBe('green');
  });

  it('should add multiple notifications', () => {
    notificationsStore.addNotification({
      message: 'Error Notification',
    });
    notificationsStore.addNotification({
      type: NOTIFICATION_TYPE.Warning,
      message: 'Warning Notification',
    });

    let notifications;
    notificationsStore.subscribe(value => {
      notifications = value.notifications;
    })();

    expect(notifications).toHaveLength(2);
    expect(notifications[0].message).toBe('Error Notification');
    expect(notifications[0].count).toBe(1);
    expect(notifications[0].icon).toBe('error');
    expect(notifications[0].color).toBe('red');

    expect(notifications[1].message).toBe('Warning Notification');
    expect(notifications[1].count).toBe(1);
    expect(notifications[1].icon).toBe('warning');
    expect(notifications[1].color).toBe('yellow');
  });

  it('should update existing notification if the message is the same', () => {
    notificationsStore.addNotification({
      type: NOTIFICATION_TYPE.Info,
      message: 'Test Notification',
      timeout: 3000,
    });

    notificationsStore.addNotification({
      type: NOTIFICATION_TYPE.Info,
      message: 'Test Notification',
      timeout: 3000,
    });

    let notifications;
    notificationsStore.subscribe(value => {
      notifications = value.notifications;
    })();

    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toBe('Test Notification');
    expect(notifications[0].count).toBe(2);
  });

  it('should reset the timeout for an existing notification', () => {
    notificationsStore.addNotification({
      type: NOTIFICATION_TYPE.Info,
      message: 'Test Notification',
      timeout: 3000,
    });

    let notifications;
    notificationsStore.subscribe(value => {
      notifications = value.notifications;
    })();

    const initialTimeoutRef = notifications[0].timeoutRef;

    notificationsStore.addNotification({
      type: NOTIFICATION_TYPE.Info,
      message: 'Test Notification', // Same message
      timeout: 3000,
    });

    notificationsStore.subscribe(value => {
      notifications = value.notifications;
    })();

    expect(notifications[0].timeoutRef).not.toBe(initialTimeoutRef);

    vi.advanceTimersByTime(3000);
    expect(notifications).toHaveLength(0);
  });
});

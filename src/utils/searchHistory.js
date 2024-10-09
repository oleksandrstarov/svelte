import { NOTIFICATION_TYPE, notificationsStore } from '../stores/notification';
import { get } from 'svelte/store';
import { t } from 'svelte-i18n';

let locationsHistory = [];

try {
  const storedData = localStorage.getItem('locationsHistory');
  locationsHistory = storedData ? JSON.parse(storedData) : [];
} catch (error) {
  notificationsStore.addNotification({
    type: NOTIFICATION_TYPE.Error,
    message: get(t)('errors.getLocalHistory'),
  });
  console.error(error);
  locationsHistory = [];
}

export const removeFromHistory = placeId => {
  const locationIndex = locationsHistory.findIndex(location => location.placeId === placeId);

  if (locationIndex === -1) {
    return;
  }

  locationsHistory.splice(locationIndex, 1);
  localStorage.setItem('locationsHistory', JSON.stringify(locationsHistory));
};

export const addToHistory = ({ placeName, placeId, lat, lng }) => {
  removeFromHistory(placeId);

  const updatedHistory = [{ placeName, placeId, lat, lng }, ...locationsHistory].splice(0, 5);

  localStorage.setItem('locationsHistory', JSON.stringify(updatedHistory));

  locationsHistory = updatedHistory;
};

export const getLocationsHistoryAutocomplete = () =>
  locationsHistory?.map(({ placeId, placeName }) => ({ placeId, placeName })) || [];

export const addToHistory = (placeName, placeId, lat, lng) => {
  const locationsHistory = JSON.parse(localStorage.getItem('locationsHistory')) || [];
  const locationIndex = locationsHistory.findIndex(location => location.placeId === placeId);

  if (locationIndex !== -1) {
    locationsHistory.splice(locationIndex, 1);
  }

  if (locationsHistory.length > 4) {
    locationsHistory.shift();
  }

  locationsHistory.push({ placeName, placeId, lat, lng });
  localStorage.setItem('locationsHistory', JSON.stringify(locationsHistory));
};

export const getLocationsHistoryAutocomplete = () => {
  const locationsHistory = localStorage.getItem('locationsHistory');

  return (
    JSON.parse(locationsHistory)
      ?.reverse()
      .map(({ placeId, placeName }) => ({ placeId, placeName })) || []
  );
};

import SunCalc from 'suncalc';

export function getDayPeriodById(id) {
  return id === 1 ? 'day' : 'night';
}

export function getDayPeriodByDate({ date, lat, lng }) {
  const formattedDate = new Date(date);
  const times = SunCalc.getTimes(formattedDate, lat, lng);

  const sunrise = times.sunrise;
  const sunset = times.sunset;

  if (formattedDate >= sunrise && formattedDate < sunset) {
    return 'day';
  } else {
    return 'night';
  }
}

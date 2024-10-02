export default function getDayPeriod(time) {
  const hours = new Date(time)
    .getHours();
  const startOfDay = 6;
  const endOfDay = 18;

  return hours >= startOfDay && hours < endOfDay ? 'day' : 'night';
}

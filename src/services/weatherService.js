import axios from 'axios';
import { notificationsStore } from '../stores/notification';
import { get } from 'svelte/store';
import { t } from 'svelte-i18n';

const baseUrl = 'https://api.open-meteo.com/v1';

class WeatherService {
  async getWeather(latitude, longitude) {
    try {
      const params = {
        latitude,
        longitude,
        current:
          'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day',
      };

      const response = await axios.get(`${baseUrl}/forecast`, { params });

      return {
        temperature: response.data.current.temperature_2m,
        feelsLike: response.data.current.apparent_temperature,
        precipitation: response.data.current.precipitation,
        weatherCode: response.data.current.weather_code,
        windSpeed: response.data.current.wind_speed_10m,
        windGusts: response.data.current.wind_gusts_10m,
        windDirection: response.data.current.wind_direction_10m,
        timeOfDayId: response.data.current.is_day,
      };
    } catch (e) {
      notificationsStore.addNotification({
        message: `${get(t)('errors.getWeather')}`,
      });
      console.error(e.message);
    }
  }
}

const weatherService = new WeatherService();
export default weatherService;

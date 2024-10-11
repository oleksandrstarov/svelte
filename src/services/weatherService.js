import axios from 'axios';
import { NOTIFICATION_TYPE, notificationsStore } from '../stores/notification';
import { get } from 'svelte/store';
import { t } from 'svelte-i18n';
import { DateTime } from 'luxon';
import { temperatureUnit } from '../stores/temperature';

const baseUrl = 'https://api.open-meteo.com/v1';

class WeatherService {
  async getWeather(latitude, longitude) {
    try {
      const temperatureUnit = this.#getTemperatureUnit();

      const params = {
        latitude,
        longitude,
        current:
          'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day',
        timezone: 'auto',
        temperature_unit: `${temperatureUnit}`,
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
        type: NOTIFICATION_TYPE.Error,
        message: `${get(t)('errors.getWeather')}`,
      });
      console.error(e.message);
    }
  }

  async getWeeklyForecast(latitude, longitude) {
    try {
      const temperatureUnit = this.#getTemperatureUnit();

      const params = {
        latitude,
        longitude,
        daily:
          'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
        timezone: 'auto',
        temperature_unit: `${temperatureUnit}`,
      };

      const response = await axios.get(`${baseUrl}/forecast`, { params });
      setTimeout(() => {}, 3000);

      return {
        daily: response.data.daily,
      };
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: `${get(t)('errors.getWeeklyForecast')}`,
      });
      console.error(e.message);
    }
  }

  async getHourlyForecast(latitude, longitude, selectedDate) {
    try {
      const temperatureUnit = this.#getTemperatureUnit();

      const params = {
        latitude,
        longitude,
        hourly: `
          temperature_2m,
          relative_humidity_2m,
          dew_point_2m,
          apparent_temperature,
          precipitation,
          weather_code,
          surface_pressure,
          cloud_cover,
          visibility,
          evapotranspiration,
          vapour_pressure_deficit,
          wind_speed_10m,
          wind_direction_10m,
          wind_gusts_10m
        `
          .trim()
          .replace(/\s+/g, ''),
        timezone: 'auto',
        temperature_unit: `${temperatureUnit}`,
      };

      const now = DateTime.now();

      const { data } = await axios.get(`${baseUrl}/forecast`, { params });

      return data.hourly.time
        .filter(time => time.startsWith(selectedDate) && DateTime.fromISO(time) > now)
        .map((time, index) => ({
          time,
          temperature: data.hourly.temperature_2m[index],
          feelsLike: data.hourly.apparent_temperature[index],
          dewPoint: data.hourly.dew_point_2m[index],
          precipitation: data.hourly.precipitation[index],
          windSpeed: data.hourly.wind_speed_10m[index],
          windDirection: data.hourly.wind_direction_10m[index],
          windGusts: data.hourly.wind_gusts_10m[index],
          pressure: data.hourly.surface_pressure[index],
          humidity: data.hourly.relative_humidity_2m[index],
          cloudCover: data.hourly.cloud_cover[index],
          visibility: data.hourly.visibility[index],
          evapotranspiration: data.hourly.evapotranspiration[index],
          vpd: data.hourly.vapour_pressure_deficit[index],
          weatherCode: data.hourly.weather_code[index],
        }));
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: `${get(t)('errors.getHourlyForecast')}`,
      });
      console.error(e.message);
    }
  }

  #getTemperatureUnit() {
    return get(temperatureUnit) === 'f' ? 'fahrenheit' : 'celsius';
  }
}

const weatherService = new WeatherService();
export default weatherService;

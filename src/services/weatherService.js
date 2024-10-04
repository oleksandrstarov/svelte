import axios from 'axios';

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
    } catch (error) {
      console.log('Error fetching weather data:', error.message);
    }
  }

  async getWeeklyForecast(latitude, longitude) {
    try {
      const params = {
        latitude,
        longitude,
        daily:
          'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
      };

      const response = await axios.get(`${baseUrl}/forecast`, { params });

      return {
        daily: response.data.daily,
      };
    } catch (error) {
      console.log('Error fetching weekly forecast:', error.message);
      throw error;
    }
  }
}

const weatherService = new WeatherService();
export default weatherService;

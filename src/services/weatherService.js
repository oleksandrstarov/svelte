import axios from 'axios';

const baseUrl = 'https://api.open-meteo.com/v1';

class WeatherService {
  async getWeather(latitude, longitude) {
    try {
      const params = {
        latitude,
        longitude,
        current:
          'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
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
        time: response.data.current.time,
      };
    } catch (error) {
      console.log('Error fetching weather data:', error.message);
      throw error;
    }
  }

  async fetchWeatherData(latitude, longitude) {
    const data = await this.getWeather(latitude, longitude);

    return {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windGusts: data.current.wind_gusts_10m,
      windDirection: data.current.wind_direction_10m,
      time: data.current.time,
    };
  }
}

const weatherService = new WeatherService();
export default weatherService;

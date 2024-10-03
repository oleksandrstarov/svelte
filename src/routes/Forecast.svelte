<script>
  import ForecastMainBanner from '../components/ForecastMainBanner.svelte';
  import weatherService from '../services/weatherService';

  export let params;

  let weatherData = {};

  async function fetchWeatherData(latitude, longitude) {
    weatherData.isLoading = true;
    weatherData.hasError = false;

    const data = await weatherService.getWeather(latitude, longitude);

    if (!data) {
      weatherData.isLoading = false;
      weatherData.hasError = true;

      return;
    }

    weatherData = {
      temperature: data.temperature ?? null,
      feelsLike: data.feelsLike ?? null,
      precipitation: data.precipitation ?? null,
      weatherCode: data.weatherCode ?? null,
      windSpeed: data.windSpeed ?? null,
      windDirection: data.windDirection ?? null,
      windGusts: data.windGusts ?? null,
      timeOfDayId: data.timeOfDayId ?? null,
      isLoading: false,
      hasError: false,
    };
  }

  $: if (params.latitude && params.longitude) {
    fetchWeatherData(params.latitude, params.longitude);
  }
</script>

<ForecastMainBanner {...weatherData} />

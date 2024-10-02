<script>
  import ForecastMainBanner from '../components/ForecastMainBanner.svelte';
  import weatherService from '../services/weatherService';

  export let params;

  let weatherData = {};

  $: if (params.latitude && params.longitude) {
    (async () => {
      weatherData.isLoading = true;
      weatherData.hasError = false;
      try {
        const data = await weatherService.fetchWeatherData(params.latitude, params.longitude);

        if (!data) {
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
          time: data.time ?? null,
        };
      } catch {
        weatherData.hasError = true;
      } finally {
        weatherData.isLoading = false;
      }
    })();
  }
</script>

<ForecastMainBanner {weatherData} />

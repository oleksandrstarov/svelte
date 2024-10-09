<script>
  import weatherService from '../services/weatherService';
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from 'flowbite-svelte';
  import { DateTime } from 'luxon';
  import { link } from 'svelte-spa-router';
  import weatherCodes from '../assets/weather-interpretation-code-description.json';
  import { t } from 'svelte-i18n';

  export let latitude;
  export let longitude;

  const weatherData = {
    isLoading: false,
    hasError: false,
  };
  let forecastData = [];
  const detailsRoute = '/details';

  function formatDate(dateString) {
    return DateTime.fromISO(dateString).toFormat('cccc dd LLL');
  }

  async function fetchWeatherData(latitude, longitude) {
    weatherData.isLoading = true;
    weatherData.hasError = false;

    const response = await weatherService.getWeeklyForecast(latitude, longitude);
    if (!response) {
      weatherData.isLoading = false;
      weatherData.hasError = true;

      return;
    }

    const dailyData = response.daily;

    forecastData = dailyData.time?.map((time, i) => ({
      date: formatDate(time),
      rawDate: time,
      maxTemp: dailyData.temperature_2m_max[i],
      minTemp: dailyData.temperature_2m_min[i],
      precipitation: dailyData.precipitation_sum[i],
      windSpeed: dailyData.wind_speed_10m_max[i],
      weatherCode: dailyData.weather_code[i],
    }));

    weatherData.isLoading = false;
  }

  $: if (latitude && longitude) {
    fetchWeatherData(latitude, longitude);
  }
</script>

<div class="p-5 md:p-10">
  {#if weatherData.isLoading}
    <div>{$t('weeklyForecast.loading')}</div>
  {:else if weatherData.hasError}
    <div>{$t('errors.getWeeklyForecast')}</div>
  {:else}
    <div class="block lg:hidden">
      <div class="grid grid-cols-1 gap-4">
        {#each forecastData as { date, weatherCode, maxTemp, minTemp, precipitation, windSpeed, rawDate }}
          <div class="bg-white shadow-md rounded-md p-4 flex flex-col items-center">
            <div class="text-center font-bold">{date}</div>
            {#if weatherCode !== null && weatherCodes[weatherCode]?.['day']?.image}
              <img
                class="w-16 h-16 object-cover"
                src={weatherCodes[weatherCode]['day'].image}
                alt="weather"
              />
            {/if}
            <div class="text-lg">
              <span class={`text-${maxTemp >= 0 ? 'red' : 'blue'}-500`}>{maxTemp}°C</span>
              /
              <span class={`text-${minTemp >= 0 ? 'red' : 'blue'}-500`}>{minTemp}°C</span>
            </div>
            <div class="text-sm">
              <span class="text-blue-500">{precipitation} {$t('weeklyForecast.millimeters')}</span>
              |
              <span>{windSpeed} {$t('weeklyForecast.kilometersPerHour')}</span>
            </div>
            <a
              href={`${detailsRoute}/${latitude}/${longitude}/${rawDate}`}
              use:link
              class="text-blue-500 hover:underline mt-2"
            >
              {$t('weeklyForecast.openHourlyForecast')}
            </a>
          </div>
        {/each}
      </div>
    </div>

    <div class="hidden lg:block shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-md">
      <Table shadow hoverable={true}>
        <TableHead>
          <TableHeadCell></TableHeadCell>
          <TableHeadCell class="hidden md:table-cell">{$t('weeklyForecast.weather')}</TableHeadCell>
          <TableHeadCell>{$t('weeklyForecast.temperature')}</TableHeadCell>
          <TableHeadCell class="hidden md:table-cell"
            >{$t('weeklyForecast.precipitation')}</TableHeadCell
          >
          <TableHeadCell class="hidden md:table-cell">{$t('weeklyForecast.wind')}</TableHeadCell>
          <TableHeadCell></TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each forecastData as { date, weatherCode, maxTemp, minTemp, precipitation, windSpeed, rawDate }}
            <TableBodyRow>
              <TableBodyCell>{date}</TableBodyCell>
              <TableBodyCell class="hidden md:table-cell">
                {#if weatherCode !== null && weatherCodes[weatherCode]?.['day']?.image}
                  <img
                    class="w-12 h-12 object-cover"
                    src={weatherCodes[weatherCode]['day'].image}
                    alt="weather"
                  />
                {/if}
              </TableBodyCell>
              <TableBodyCell>
                <span class={`text-${maxTemp >= 0 ? 'red' : 'blue'}-500`}>{maxTemp}°C</span> /
                <span class={`text-${minTemp >= 0 ? 'red' : 'blue'}-500`}>{minTemp}°C</span>
              </TableBodyCell>
              <TableBodyCell class="hidden md:table-cell text-blue-500">
                {precipitation}
                {$t('weeklyForecast.millimeters')}
              </TableBodyCell>
              <TableBodyCell class="hidden md:table-cell">
                {windSpeed}
                {$t('weeklyForecast.kilometersPerHour')}
              </TableBodyCell>
              <TableBodyCell>
                <a href={`${detailsRoute}/${latitude}/${longitude}/${rawDate}`} use:link
                  >{$t('weeklyForecast.openHourlyForecast')}</a
                >
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  {/if}
</div>

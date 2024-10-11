<script>
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from 'flowbite-svelte';
  import { DateTime } from 'luxon';
  import { t } from 'svelte-i18n';
  import { Spinner } from 'flowbite-svelte';
  import weatherService from '../services/weatherService';
  import weatherCodes from '../assets/weather-interpretation-code-description.json';
  import { getDayPeriodByDate } from '../utils/dayPeriod';
  import { temperatureUnit } from '../stores/temperature';
  import TemperatureSymbol from '../components/TemperatureSymbol.svelte';

  export let params;

  let hourlyData = [];
  const weatherData = {
    isLoading: false,
    hasError: false,
  };

  $: temperatureUnit.subscribe(() => {
    fetchWeather();
  });

  const fetchWeather = async () => {
    weatherData.isLoading = true;
    const { date, latitude: lat, longitude: lng } = params;
    const response = await weatherService.getHourlyForecast(lat, lng, date);
    hourlyData = response.map(data => ({
      ...data,
      time: DateTime.fromISO(data.time).toFormat('HH:mm'),
    }));
    if (!hourlyData.length) {
      weatherData.isLoading = false;
      weatherData.hasError = true;

      return;
    }
    hourlyData = hourlyData.map((el, idx) => ({
      ...el,
      dayPeriod: getDayPeriodByDate({ date: response[idx].time, lat, lng }),
    }));
    weatherData.isLoading = false;
  };
</script>

<div class="flex items-center px-5 md:px-10 pt-5 md:pt-10 relative">
  {#if weatherData.isLoading}
    <div class="absolute left-[45rem] top-[20rem]">
      <Spinner size={10} />
    </div>
  {/if}
</div>
<div>
  {#if weatherData.hasError}
    <div>{$t('errors.getWeeklyForecast')}</div>
  {:else}
    <div class="block lg:hidden">
      <div class="grid grid-cols-1 gap-4">
        {#if hourlyData.length}
          {#each hourlyData as { time, weatherCode, dayPeriod, temperature, feelsLike, precipitation, windSpeed }}
            <div
              class="bg-white rounded-xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)] p-4 flex flex-col items-center"
            >
              <div class="text-center font-bold">{time ?? ''}</div>
              {#if weatherCode !== null && weatherCodes[weatherCode]?.[dayPeriod]?.image}
                <img
                  class="w-16 h-16 object-cover"
                  src={weatherCodes[weatherCode][dayPeriod].image}
                  alt="weather"
                />
              {/if}
              <div class="text-lg">
                <span class={`text-${temperature >= 0 ? 'red' : 'blue'}-500`}
                  >{temperature} (<TemperatureSymbol />)</span
                >
                /
                <span class={`text-${feelsLike >= 0 ? 'red' : 'blue'}-500`}
                  >{feelsLike} (<TemperatureSymbol />)</span
                >
              </div>
              <div class="text-sm">
                <span class="text-blue-500">{precipitation} {$t('hourlyForecast.millimeters')}</span
                >
                |
                <span>{windSpeed} {$t('hourlyForecast.kilometersPerHour')}</span>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <Table
      hoverable={true}
      divClass="mt-2 rounded-3xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)] hidden lg:block"
    >
      <TableHead>
        <TableHeadCell>{$t('hourlyForecast.time')}</TableHeadCell>
        <TableHeadCell>{$t('hourlyForecast.weather')}</TableHeadCell>
        <TableHeadCell>{$t('hourlyForecast.temperature')} (<TemperatureSymbol />)</TableHeadCell>
        <TableHeadCell>{$t('hourlyForecast.feelsLike')} (<TemperatureSymbol />)</TableHeadCell>
        <TableHeadCell>{$t('hourlyForecast.dewPoint')}</TableHeadCell>
        <TableHeadCell>{$t('hourlyForecast.precipitation')}</TableHeadCell>
        <TableHeadCell
          >{$t('hourlyForecast.windSpeed')} + {$t('hourlyForecast.windDirection')}</TableHeadCell
        >
        <TableHeadCell>{$t('hourlyForecast.windGusts')}</TableHeadCell>
        <TableHeadCell class="max-xl:hidden table-cell"
          >{$t('hourlyForecast.pressure')}</TableHeadCell
        >
        <TableHeadCell class="max-xl:hidden table-cell"
          >{$t('hourlyForecast.humidity')}</TableHeadCell
        >
        <TableHeadCell class="max-xl:hidden table-cell"
          >{$t('hourlyForecast.cloudCover')}</TableHeadCell
        >
        <TableHeadCell class="max-2xl:hidden table-cell"
          >{$t('hourlyForecast.visibility')}</TableHeadCell
        >
        <TableHeadCell class="max-2xl:hidden table-cell"
          >{$t('hourlyForecast.evaporation')}</TableHeadCell
        >
        <TableHeadCell class="max-2xl:hidden table-cell"
          >{$t('hourlyForecast.pressureDeficit')}</TableHeadCell
        >
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#if hourlyData.length}
          <!-- eslint-disable-next-line max-len -->
          {#each hourlyData as { time, weatherCode, dayPeriod, temperature, feelsLike, dewPoint, precipitation, windSpeed, windDirection, windGusts, pressure, humidity, cloudCover, visibility, evapotranspiration, vpd }}
            <TableBodyRow class="text-center">
              <TableBodyCell>{time ?? ''}</TableBodyCell>
              <TableBodyCell class="hidden md:table-cell">
                {#if weatherCode !== null && weatherCodes[weatherCode]?.['day']?.image}
                  <img
                    class="w-12 h-12 object-cover"
                    src={weatherCodes[weatherCode][dayPeriod].image}
                    alt="weather"
                  />
                {/if}
              </TableBodyCell>
              <TableBodyCell>{temperature ?? ''}</TableBodyCell>
              <TableBodyCell>{feelsLike ?? ''}</TableBodyCell>
              <TableBodyCell>{dewPoint ?? ''}</TableBodyCell>
              <TableBodyCell>{precipitation ?? ''}</TableBodyCell>
              <TableBodyCell>
                <div class="flex items-center">
                  <span>{windSpeed ?? ''}</span>
                  <span
                    class="material-symbols-outlined text-md md:text-xl transform-500"
                    style="transform: rotate({windDirection}deg);"
                  >
                    north
                  </span>
                </div>
              </TableBodyCell>
              <TableBodyCell>{windGusts ?? ''}</TableBodyCell>
              <TableBodyCell tdClass="table-cell max-xl:hidden font-medium"
                >{pressure ?? ''}</TableBodyCell
              >
              <TableBodyCell tdClass="table-cell max-xl:hidden font-medium"
                >{humidity ?? ''}</TableBodyCell
              >
              <TableBodyCell tdClass="table-cell max-xl:hidden font-medium"
                >{cloudCover ?? ''}</TableBodyCell
              >
              <TableBodyCell tdClass="table-cell max-2xl:hidden font-medium"
                >{visibility ?? ''}</TableBodyCell
              >
              <TableBodyCell tdClass="table-cell max-2xl:hidden font-medium"
                >{evapotranspiration ?? ''}</TableBodyCell
              >
              <TableBodyCell tdClass="table-cell max-2xl:hidden font-medium"
                >{vpd ?? ''}</TableBodyCell
              >
            </TableBodyRow>
          {/each}
        {/if}
      </TableBody>
    </Table>
  {/if}
</div>

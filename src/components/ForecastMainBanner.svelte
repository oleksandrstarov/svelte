<script>
  import { Spinner } from 'flowbite-svelte';

  import thermostat from '../assets/thermostat.svg';
  import arrow from '../assets/arrow.svg';
  import umbrella from '../assets/umbrella.svg';
  import air from '../assets/air.svg';
  import clock from '../assets/clock.svg';
  import weatherCodes from '../assets/weather-interpretation-code-description.json';
  import getDayPeriod from '../utils/dayPeriod';

  export let weatherData = {};
  const dayPeriod = getDayPeriod(weatherData.time);
</script>

<div class="p-5 md:p-10">
  <div class="pt-2 p-4 md:pt-5 md:px-10 rounded-lg forecast-panel">
    <h2 class="flex items-center font-medium text-sm md:text-lg">
      <span>
        <img class="h-4 md:h-6" src={clock} alt="clock" />
      </span>
      <span>&nbsp;Current conditions</span>
    </h2>

    {#if weatherData.isLoading}
      <div class="flex justify-center items-center p-4 md: pt-5">
        <Spinner />
      </div>
    {:else if weatherData.hasError}
      <div class="flex justify-center items-center p-4 md: pt-5">
        <p>No data received</p>
      </div>
    {:else}
      <div class="flex justify-between items-center">
        {#if weatherData.weatherCode !== null && weatherCodes[weatherData.weatherCode]?.[dayPeriod]?.image}
          <div class="basis-1/2 md:basis-1/4">
            <span>
              <img
                class="min-h-24 h-24 md:h-32"
                src={weatherCodes[weatherData.weatherCode][dayPeriod].image}
                alt="weather"
              />
            </span>
          </div>
        {/if}

        <div
          class="forcast-info flex flex-col md:flex-row justify-between items-left basis-1/2 md:basis-3/4"
        >
          {#if weatherData.temperature !== null}
            <div class="flex mt-2 items-end">
              <span class="text-4xl md:text-5xl">
                <img class="h-8 md:h-10" src={thermostat} alt="thermostat" />
              </span>
              <span class="text-red-600 text-4xl md:text-5xl">
                {weatherData.temperature}°
              </span>
              {#if weatherData.feelsLike !== null}
                <span class="ml-2 md:ml-4 text-sm md:text-lg">
                  Feels like
                  <span class="text-red-600">{weatherData.feelsLike}°</span>
                </span>
              {/if}
            </div>
          {/if}

          {#if weatherData.precipitation !== null}
            <div class="flex mt-2 items-end">
              <span>
                <img class="h-8 md:h-10" src={umbrella} alt="umbrella" />
              </span>
              <span class="ml-2 md:ml-4 text-4xl md:text-5xl text-blue-500"
                >{weatherData.precipitation}</span
              >
              <span>&nbsp;mm</span>
            </div>
          {/if}

          {#if weatherData.windSpeed !== null}
            <div class="flex mt-2 items-end">
              <span>
                <img class="h-8 md:h-10" src={air} alt="air" />
              </span>
              <span class="ml-2 md:ml-4 text-4xl md:text-5xl">
                {weatherData.windSpeed}
              </span>
              {#if weatherData.windGusts !== null}
                <span class="ml-2 text-sm md:text-lg">
                  ({weatherData.windGusts}) m/s
                </span>
              {/if}
              <span>
                <img
                  class="h-8 md:h-10 relative z-[-10]"
                  src={arrow}
                  alt="arrow"
                  style="transform: rotate({weatherData.windDirection}deg); transition: transform 0.5s;"
                />
              </span>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .forecast-panel {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
</style>

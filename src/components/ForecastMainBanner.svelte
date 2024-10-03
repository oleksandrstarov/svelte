<script>
  import { Spinner } from 'flowbite-svelte';
  import { t } from 'svelte-i18n';

  import weatherCodes from '../assets/weather-interpretation-code-description.json';
  import getDayPeriod from '../utils/dayPeriod';

  export let {
    temperature,
    feelsLike,
    precipitation,
    weatherCode,
    windSpeed,
    windDirection,
    windGusts,
    isDay,
    isLoading,
    hasError,
  } = {};

  $: dayPeriod = getDayPeriod(isDay);
</script>

<div class="p-5 md:p-10">
  <div class="pt-2 p-4 md:pt-5 md:px-10 rounded-lg shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
    <h2 class="flex items-center font-medium text-sm md:text-lg">
      <span class="material-symbols-outlined text-1xl md:text-2xl"> schedule </span>
      <span class="ml-1">{$t('forecastMainBanner.currentConditions')}</span>
    </h2>

    {#if isLoading}
      <div class="flex justify-center items-center p-4 md: pt-5">
        <Spinner />
      </div>
    {:else if hasError}
      <div class="flex justify-center items-center p-4 md: pt-5">
        <p>{$t('forecastMainBanner.noDataReceived')}</p>
      </div>
    {:else}
      <div class="flex justify-between items-center">
        {#if weatherCode !== null && weatherCodes[weatherCode]?.[dayPeriod]?.image}
          <div class="basis-1/2 md:basis-1/4">
            <span>
              <img
                class="min-h-24 h-24 md:h-32"
                src={weatherCodes[weatherCode][dayPeriod].image}
                alt="weather"
              />
            </span>
          </div>
        {/if}

        <div class="flex flex-col md:flex-row justify-between items-left basis-1/2 md:basis-3/4">
          {#if temperature !== null}
            <div class="flex mt-2 items-end">
              <span class="material-symbols-outlined text-3xl md:text-4xl"> thermostat </span>
              <span class={`text-4xl md:text-5xl text-${temperature >= 0 ? 'red' : 'blue'}-500`}>
                {temperature}°
              </span>
              {#if feelsLike !== null}
                <span class="ml-2 md:ml-4 text-sm md:text-lg">
                  {$t('forecastMainBanner.feelsLike')}
                  <span class={`text-${temperature >= 0 ? 'red' : 'blue'}-500`}>
                    {feelsLike}°
                  </span>
                </span>
              {/if}
            </div>
          {/if}

          {#if precipitation !== null}
            <div class="flex mt-2 items-end">
              <span class="material-symbols-outlined text-3xl md:text-4xl"> water_drop </span>
              <span class="ml-2 md:ml-4 text-4xl md:text-5xl text-blue-500"> {precipitation}</span>
              <span class="ml-1">{$t('forecastMainBanner.millimeters')}</span>
            </div>
          {/if}

          {#if windSpeed !== null}
            <div class="flex mt-2 items-end">
              <span class="material-symbols-outlined text-3xl md:text-4xl"> air </span>
              <span class="ml-2 md:ml-4 text-4xl md:text-5xl">
                {windSpeed}
              </span>
              {#if windGusts !== null}
                <span class="ml-2 text-sm md:text-lg">
                  ({windGusts}) {$t('forecastMainBanner.metersPerSecond')}
                </span>
              {/if}
              <span
                class="material-symbols-outlined text-2xl md:text-3xl transform-500 relative z-[-10]"
                style="transform: rotate({windDirection}deg);"
              >
                north
              </span>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

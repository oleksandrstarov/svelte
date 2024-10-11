<script>
  import logo from '/src/assets/svelte.svg';
  import { link, location, params } from 'svelte-spa-router';
  import { Select, Spinner } from 'flowbite-svelte';
  import placesService from '../services/placeService';
  import { t, locale } from 'svelte-i18n';
  import ForecastSearch from './ForecastSearch.svelte';
  import { temperatureUnit } from '../stores/temperature';

  const languages = [
    { value: 'en-US', name: $t('header.language.en') },
    { value: 'ua-UA', name: $t('header.language.ua') },
  ];

  const temperatureUnits = [
    { value: 'c', name: '°C' },
    { value: 'f', name: '°F' },
  ];

  let isSearchButton = true;
  let isAddressLoading = '';
  let currentAddress = '';
  let selectedTemperatureUnit = '';

  $: isSearchPage = $location.includes('/search');
  $: selectedLang = $locale;

  $: {
    if ($params?.latitude && $params?.longitude) {
      fetchAddress($params.latitude, $params.longitude);
    } else {
      currentAddress = '';
    }
  }

  temperatureUnit.subscribe(unit => {
    selectedTemperatureUnit = unit;
  });

  const setIsSearchButton = ({ detail }) => {
    isSearchButton = detail;
  };

  const fetchAddress = async (latitude, longitude) => {
    isAddressLoading = true;

    const placeId = await placesService.getId(latitude, longitude);
    const { address } = await placesService.getDetails(placeId);

    isAddressLoading = false;
    currentAddress = address;
  };
</script>

<header class="flex justify-center flex-wrap sm:justify-between sm:items-center sticky">
  <div class="flex sm:items-center">
    <a class="flex items-center" use:link={{ href: '/' }}>
      <img class="h-12" src={logo} alt="logo" />
    </a>
    {#if !isSearchPage && isSearchButton}
      <div class="flex flex-col ml-3">
        <h1 class="text-xl">Svelte</h1>
        <span class="mr-2 text-sm">
          {currentAddress}
          {#if isAddressLoading}
            <Spinner size={5} />
          {/if}
        </span>
      </div>
    {/if}
  </div>
  <div class="flex grow justify-end">
    <ForecastSearch {isSearchButton} on:setIsSearchButton={setIsSearchButton} />
    {#if isSearchButton}
      <Select
        placeholder=""
        class="w-20 h-12 m-2 border-primary-700 bg-white text-primary-700 font-semibold cursor-pointer"
        items={languages}
        value={selectedLang}
        on:input={({ target: { value } }) => locale.set(value)}
      />
      <Select
        placeholder=""
        class="w-20 h-12 m-2 border-primary-700 bg-white text-primary-700 font-semibold cursor-pointer"
        items={temperatureUnits}
        value={selectedTemperatureUnit}
        on:change={({ target: { value } }) => temperatureUnit.set(value)}
      />
    {/if}
  </div>
</header>

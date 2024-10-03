<script>
  import logo from '/src/assets/svelte.svg';
  import { link, location, push, params } from 'svelte-spa-router';
  import { Button, Input, Select } from 'flowbite-svelte';
  import placesService from '../services/placesService';
  import { clickOutside } from '../directives/clickOutside';
  import { debounce } from 'lodash';
  import { t, locale } from 'svelte-i18n';

  const languages = [
    { value: 'en-US', name: $t('header.language.en') },
    { value: 'ua-UA', name: $t('header.language.ua') },
  ];

  let searchInputContainerRef;

  let searchValue = '';
  let placesAutocomplete = [];
  let isSearchButton = true;
  let isAutocompleteLoading = false;
  let currentAddress = '';

  $: searchInputRef = searchInputContainerRef?.querySelector('input');

  $: isNoData = !placesAutocomplete.length && searchValue && !isAutocompleteLoading;
  $: isSearchPage = $location.includes('/search');
  $: selectedLang = $locale;

  $: {
    if (!searchValue) {
      placesAutocomplete = getLocationsHistoryAutocomplete();
      searchInputRef?.focus();
    } else {
      getAutocomplete(searchValue);
    }
  }
  $: {
    if ($params) {
      getAddress($params.latitude, $params.longitude);
    } else {
      currentAddress = '';
    }
  }

  const toggleIsSearchButton = () => {
    searchValue = '';
    isSearchButton = !isSearchButton;
  };

  const updateSearchValue = debounce(async value => {
    searchValue = value.trim();
  }, 300);

  const getAutocomplete = async value => {
    isAutocompleteLoading = true;

    const autocomplete = await placesService.getAutocomplete(value);

    placesAutocomplete = [...autocomplete];
    isAutocompleteLoading = false;
  };

  const navigateToForecast = async (placeId, placeName) => {
    const {
      location: { lat, lng },
    } = await placesService.getDetails(placeId);

    addToHistory(placeName, placeId, lat, lng);
    toggleIsSearchButton();
    push(`/forecast/${lat}/${lng}`);
  };

  const getAddress = async (latitude, longitude) => {
    if (currentAddress) {
      return;
    }
    const placeId = await placesService.getId(latitude, longitude);
    const { address } = await placesService.getDetails(placeId);
    currentAddress = address;
  };

  const onKeydown = e => {
    if (e.key === 'Enter' && placesAutocomplete.length) {
      navigateToForecast(placesAutocomplete[0]['placeId'], placesAutocomplete[0]['placeName']);
    }
  };

  const addToHistory = (placeName, placeId, lat, lng) => {
    const locationsHistory = JSON.parse(localStorage.getItem('locationsHistory')) || [];

    const existingIndex = locationsHistory.findIndex(location => location.placeId === placeId);
    if (existingIndex !== -1) {
      locationsHistory.splice(existingIndex, 1);
    }

    if (locationsHistory.length > 4) {
      locationsHistory.shift();
    }

    locationsHistory.push({ placeName, placeId, lat, lng });

    localStorage.setItem('locationsHistory', JSON.stringify(locationsHistory));
    currentAddress = placeName;
  };

  const getLocationsHistoryAutocomplete = () => {
    const locationsHistory = localStorage.getItem('locationsHistory');

    return (
      JSON.parse(locationsHistory)
        ?.reverse()
        .map(({ placeId, placeName }) => ({ placeId, placeName })) || []
    );
  };
</script>

<header
  class="flex justify-center flex-wrap pt-2 px-4 md:pt-5 md:px-10 sm:justify-between sm:items-center sticky"
>
  <div class="flex sm:items-center">
    <a use:link={{ href: '/' }}>
      <img class="h-12" src={logo} alt="logo" />
    </a>
    {#if !isSearchPage && isSearchButton}
      <div class="flex flex-col ml-3">
        <h1 class="text-xl">Svelte</h1>
        <span class="text-sm pr-2">{currentAddress}</span>
      </div>
    {/if}
  </div>

  {#if isSearchButton}
    <div class="flex">
      <Button
        size="xs"
        class="text-md text-primary-700 outline-primary-700 m-2 hover:bg-primary-50 hover:text-primary-700 focus-within:ring-0"
        outline
        on:click={toggleIsSearchButton}
      >
        <span class="material-symbols-outlined pr-1">search</span>
        {$t('header.search')}
      </Button>
      <Select
        placeholder=""
        class="w-20 h-12 m-2 border-primary-700 bg-white text-primary-700 font-semibold"
        items={languages}
        value={selectedLang}
        on:input={({ target: { value } }) => locale.set(value)}
      />
    </div>
  {:else}
    <div class="flex-grow">
      <div class="pl-4 md:pl-10 relative" use:clickOutside on:clickOutside={toggleIsSearchButton}>
        <div class="content" bind:this={searchInputContainerRef}>
          <Input
            value={searchValue}
            placeholder={$t('header.searchPlaceholder')}
            class="w-full h-12 my-2"
            on:keydown={onKeydown}
            on:input={({ target: { value } }) => updateSearchValue(value)}
          >
            <span slot="left" class="material-symbols-outlined">search</span>
            <span class="flex items-center" slot="right">
              {#if searchValue && !isAutocompleteLoading}
                <span
                  class="material-symbols-outlined cursor-pointer"
                  on:click={() => (searchValue = '')}
                >
                  cancel
                </span>
              {:else if searchValue && isAutocompleteLoading}
                <span class="material-symbols-outlined animate-spin"> refresh </span>
              {/if}
            </span>
          </Input>
        </div>

        <div class="absolute mt-1 w-full pr-4 md:pr-10 top bg-white">
          <ul class="shadow-lg rounded-md mt-1 max-h-80 overflow-y-auto">
            {#each placesAutocomplete as { placeName, placeId }, i (placeId)}
              <li
                class="py-2 px-2 hover:bg-primary-50 cursor-pointer first:bg-primary-50 first:border-l-4 first:border-l-primary-700"
                on:click={() => navigateToForecast(placeId, placeName)}
              >
                {placeName}
              </li>
              {#if i !== placesAutocomplete.length - 1}
                <hr />
              {/if}
            {/each}
            {#if isNoData}
              <li class="py-2 px-2 text-center">{$t('general.noData')}</li>
            {/if}
          </ul>
        </div>
      </div>
    </div>
  {/if}
</header>

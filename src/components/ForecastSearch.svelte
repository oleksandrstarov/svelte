<script>
  import { t } from 'svelte-i18n';
  import { Button, Input } from 'flowbite-svelte';
  import {
    addToHistory,
    getLocationsHistoryAutocomplete,
    removeFromHistory,
  } from '../utils/searchHistory';
  import { location, push, querystring } from 'svelte-spa-router';
  import { debounce } from 'lodash';
  import placesService from '../services/placeService';
  import { NOTIFICATION_TYPE, notificationsStore } from '../stores/notification';
  import { clickOutside } from '../directives/clickOutside';
  import { createEventDispatcher } from 'svelte';

  export let isSearchButton;

  const { addNotification } = notificationsStore;

  const dispatch = createEventDispatcher();

  let searchInputContainerRef;

  let searchValue = '';
  let placesAutocomplete = [];
  let isAutocompleteLoading = false;
  let isNearbyEnabled = true;

  $: searchInputRef = searchInputContainerRef?.querySelector('input');

  $: isNoData = !placesAutocomplete.length && searchValue && !isAutocompleteLoading;

  $: {
    if (!searchValue.trim()) {
      placesAutocomplete = getLocationsHistoryAutocomplete();
      searchInputRef?.focus();
    } else {
      getAutocomplete(searchValue);
    }
  }

  const toggleIsSearchButton = () => {
    searchValue = '';
    dispatch('setIsSearchButton', !isSearchButton);
  };

  const updateSearchValue = debounce(async value => {
    searchValue = value;
  }, 300);

  const getAutocomplete = async value => {
    isAutocompleteLoading = true;

    const autocomplete = await placesService.getAutocomplete(value.trim());

    placesAutocomplete = [...autocomplete];
    isAutocompleteLoading = false;
  };

  const navigateToForecast = async (placeId, address) => {
    const {
      location: { lat, lng },
    } = await placesService.getDetails(placeId);

    addToHistory({ address, placeId, lat, lng });
    toggleIsSearchButton();
    push(`/forecast/${lat}/${lng}`);
  };

  async function navigateToSearch() {
    const queryParams = new URLSearchParams($querystring);

    queryParams.set('query', searchValue);

    const newQuery = queryParams.toString();

    dispatch('setIsSearchButton', true);
    push(`/?${newQuery}`);
  }

  const navigateToBrowserLocation = () => {
    if (!isNearbyEnabled) {
      addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: $t('errors.getBrowserLocation'),
      });

      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          push(`/forecast/${latitude}/${longitude}`);
          dispatch('setIsSearchButton', true);
        },
        error => {
          isNearbyEnabled = false;
          addNotification({
            type: NOTIFICATION_TYPE.Error,
            message: $t('errors.getBrowserLocation'),
          });

          console.error(error);
        },
      );

      return;
    }

    isNearbyEnabled = false;

    addNotification({
      type: NOTIFICATION_TYPE.Error,
      message: $t('errors.geolocationNotSupported'),
    });
  };

  const onKeydown = e => {
    if (e.key !== 'Enter') {
      return;
    }

    if (placesAutocomplete.length) {
      navigateToForecast(placesAutocomplete[0]['placeId'], placesAutocomplete[0]['address']);

      return;
    }

    navigateToBrowserLocation();
  };

  const onRemoveFromHistory = (e, placeId) => {
    e.stopPropagation();
    removeFromHistory(placeId);
    placesAutocomplete = getLocationsHistoryAutocomplete();
  };
</script>

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

      <div class="absolute z-50 mt-1 w-full pr-4 md:pr-10 top bg-white">
        <ul class="shadow-lg rounded-md mt-1 max-h-80 overflow-y-auto">
          {#each placesAutocomplete as { address, placeId } (placeId)}
            <li
              class="py-2 px-2 hover:bg-primary-50 cursor-pointer first:bg-primary-50
                first:border-l-4 first:border-l-primary-700 relative"
              on:click={() => navigateToForecast(placeId, address)}
            >
              {address}
              {#if !searchValue.trim()}
                <Button
                  class="absolute right-1.5 top-1.5 rounded-full hover:bg-gray-200 py-0 px-1 z-10 focus-within:ring-0"
                  color="gray"
                  size="xs"
                  on:click={e => onRemoveFromHistory(e, placeId)}
                >
                  <span class="material-symbols-outlined text-lg"> close </span>
                </Button>
              {/if}
            </li>
            <hr />
          {/each}
          {#if !searchValue}
            <li
              on:click={navigateToBrowserLocation}
              class="py-2 px-2 text-md font-bold flex items-center
              {isNearbyEnabled
                ? 'text-primary-700 hover:bg-primary-50 cursor-pointer first:bg-primary-50 first:border-l-4 first:border-l-primary-700'
                : 'hover:gray-300 first:bg-gray-200 cursor-not-allowed text-gray-500 first:border-l-0'}"
            >
              <span class="material-symbols-outlined pr-2"> near_me </span>
              {$t('header.nearby')}
            </li>
          {:else}
            <li
              class="py-2 px-2 cursor-pointer text-primary-700 hover:bg-primary-50 font-bold flex items-center
               first:bg-primary-50 first:border-l-4 first:border-l-primary-700"
              on:click={() => navigateToSearch()}
            >
              <span class="material-symbols-outlined pr-2"> search </span>
              {$t('header.moreSuggestions')}
            </li>
          {/if}

          {#if isNoData}
            <li class="py-2 px-2 text-center">{$t('general.noData')}</li>
          {/if}
        </ul>
      </div>
    </div>
  </div>
{/if}

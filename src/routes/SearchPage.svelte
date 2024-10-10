<script>
  import placeService from '../services/placeService';
  import { querystring, location, push } from 'svelte-spa-router';
  import { Spinner } from 'flowbite-svelte';
  import { addToHistory } from '../utils/searchHistory';
  import { t } from 'svelte-i18n';

  let searchValue = '';
  let searchResults = [];
  let isSearchLoading = false;

  $: {
    if ($querystring && $location) {
      const queryParams = new URLSearchParams($querystring);
      const query = queryParams.get('query');
      if (query) {
        searchValue = query;
        fetchSearchResults(query);
      }
    }
  }

  const fetchSearchResults = async query => {
    isSearchLoading = true;
    searchResults = await placeService.getSearch(query);
    isSearchLoading = false;
  };

  const navigateToForecast = ({ address, placeId, lat, lng }) => {
    push(`/forecast/${lat}/${lng}`);
    addToHistory({ address, placeId, lat, lng });
  };
</script>

{#if searchValue}
  <div class="text-2xl font-bold mt-2">
    {$t('search.searchResults')}
    {#if isSearchLoading}
      <Spinner size={3} />
    {/if}
  </div>
  {#if searchResults.length}
    <div>
      {$t('search.searchResultsCount', {
        values: { count: searchResults.length, query: searchValue },
      })}
    </div>
  {:else if !searchResults.length && !isSearchLoading}
    <div>{$t('general.noData')}</div>
  {/if}
{:else}
  <div>{$t('search.enterLocation')}</div>
{/if}

<ul class="mt-2">
  {#each searchResults as { address, placeId, lat, lng } (address)}
    <li
      class="py-4 px-2 hover:bg-primary-50 cursor-pointer flex items-center"
      on:click={() => navigateToForecast({ address, placeId, lat, lng })}
    >
      <span class="material-symbols-outlined pr-2"> location_on </span>
      {address}
    </li>
    <hr />
  {/each}
</ul>
<div class="font-bold mt-4">
  {$t('search.cantFind')}
</div>
<ul class="list-disc pl-5 pb-5">
  <li>{$t('search.checkName')}</li>
  <li>{$t('search.searchAnotherPlace')}</li>
</ul>

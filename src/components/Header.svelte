<script>
  import logo from '/src/assets/svelte.svg';
  import { Button } from 'flowbite-svelte';

  const dummyCity = 'Ukraine, Kyiv, elevation 199m';
  const dummyIsSearch = false;
  // TODO add redirection on the / on click logo
  // TODO replace dummyIsSearch with data from url
  // TODO replace dummyCity once favorite places ready
</script>

<header class="flex justify-between pt-2 px-4 md:pt-5 md:px-10 sm:items-center">
  <div class="flex sm:items-center">
    <img class="h-12" src="{logo}" alt="logo" />
    {#if !dummyIsSearch}
      <div class="flex flex-col ml-3">
        <h1 class="text-xl">Svelte</h1>
        <span class="text-sm pr-2">{dummyCity}</span>
      </div>
    {/if}
  </div>
  <div>
    <Button
      size="xs"
      class="text-md text-primary-700 outline-primary-700 hover:bg-primary-50 hover:text-primary-700 focus-within:ring-0"
      outline
    >
      <span class="material-symbols-outlined pr-1">search</span>
      Search
    </Button>
  </div>
</header>

<script>
  import { Spinner } from 'flowbite-svelte';

  import Router from 'svelte-spa-router';
  import { routes } from './routes';
  import Header from './components/Header.svelte';
  import { isLoading } from 'svelte-i18n';
</script>

<main>
  {#if !$isLoading}
    <Header />
    <Router {routes} />
  {:else}
    <div class="w-screen h-screen flex justify-center items-center">
      <Spinner />
    </div>
  {/if}
</main>

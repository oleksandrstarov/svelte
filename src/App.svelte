<script>
  import Router from 'svelte-spa-router';
  import { routes } from './routes';
  import Header from './components/Header.svelte';
  import { isLoading } from 'svelte-i18n';
  import LoadingSpinner from './components/LoadingSpinner.svelte';
</script>

<main>
  {#if !$isLoading}
    <Header />
    <Router {routes} />
  {:else}
    <LoadingSpinner />
  {/if}
</main>

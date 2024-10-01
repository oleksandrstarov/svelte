<script>
  import Router from 'svelte-spa-router';
  import { routes } from './routes/index';
  import Header from './components/Header.svelte';
  import { isLoading } from 'svelte-i18n';
</script>

<main>
  {#if !$isLoading}
    <Header />
    <Router {routes} />
  {/if}
</main>

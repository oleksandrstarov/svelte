<script>
  import { Spinner } from 'flowbite-svelte';

  import Router from 'svelte-spa-router';
  import { routes } from './routes';
  import Header from './components/Header.svelte';
  import { isLoading } from 'svelte-i18n';
  import Notifications from './components/Notifications.svelte';
</script>

<main class="pt-2 px-4 md:pt-5 md:px-10">
  {#if !$isLoading}
    <Header />
    <Router {routes} />
    <Notifications />
  {:else}
    <div class="w-screen h-screen flex justify-center items-center">
      <Spinner />
    </div>
  {/if}
</main>

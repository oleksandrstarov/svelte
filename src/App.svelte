<script>
  import { Spinner, Toast } from 'flowbite-svelte';

  import Router from 'svelte-spa-router';
  import { routes } from './routes';
  import Header from './components/Header.svelte';
  import { isLoading } from 'svelte-i18n';
  import { notificationsStore } from './stores/notification';

  const { closeNotification } = notificationsStore;

  $: notifications = $notificationsStore.notifications;
</script>

<main>
  {#if !$isLoading}
    <Header />
    <Router {routes} />
    <div class="absolute bottom-0 left-0 pl-2 pb-2 w-full">
      {#each notifications as { id, message, icon, color, count } (id)}
        <Toast
          class="relative border-2"
          {color}
          transition={() => 0}
          on:close={() => closeNotification(id)}
        >
          <svelte:fragment slot="icon">
            <span class="material-symbols-outlined"> {icon} </span>
          </svelte:fragment>
          {#if count > 1}
            <div
              class="absolute top-0 right-0 p-1 bg-white border-2 rounded-full
             w-6 h-6 flex justify-center items-center text-xs font-bold
             mt-[-0.5rem] mr-[-0.5rem]"
            >
              {count}
            </div>
          {/if}
          {message}
        </Toast>
      {/each}
    </div>
  {:else}
    <div class="w-screen h-screen flex justify-center items-center">
      <Spinner />
    </div>
  {/if}
</main>

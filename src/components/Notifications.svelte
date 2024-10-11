<script>
  import { Toast } from 'flowbite-svelte';

  import { notificationsStore } from '../stores/notification';

  const { closeNotification } = notificationsStore;

  $: notifications = $notificationsStore.notifications;
</script>

<div data-testid="notifications-element" class="absolute bottom-0 left-0 pl-2 pb-2 w-full">
  {#each notifications as { id, message, icon, color, count } (id)}
    <Toast
      class="relative border-2 my-1 shadow-neutral-50"
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

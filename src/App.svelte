<script>
  import svelteLogo from './assets/svelte.svg';
  import Router from 'svelte-spa-router';
  import { routes } from './routes/index.js';
  import { Badge } from 'flowbite-svelte';
</script>

<Router {routes} />

<main>
  <Badge>App</Badge>
  <img src={svelteLogo} alt="Svelte Logo" />
</main>

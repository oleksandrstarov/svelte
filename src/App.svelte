<script>
  import Header from './components/Header.svelte';
  import Router from 'svelte-spa-router';
  import { routes } from './routes/index.js';
</script>

<Router {routes} />

<main>
  <Header />
</main>

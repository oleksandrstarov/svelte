<script>
  import Router from 'svelte-spa-router';
  import { routes } from './routes/index';
  import Header from './components/Header.svelte';
</script>

<main>
  <Header />
  <Router {routes} />
</main>

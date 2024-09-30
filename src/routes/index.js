import Search from './Search.svelte';
import Forecast from './Forecast.svelte';
import Details from './Details.svelte';

export const routes = {
  '/': Search,
  '/forecast/:latitude/:longitude': Forecast,
  '/details/:latitude/:longitude': Details,
  '*': Search,
};

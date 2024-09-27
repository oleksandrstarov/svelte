import Search from '../pages/Search.svelte';
import Forecast from '../pages/Forecast.svelte';
import Details from '../pages/Details.svelte';

export const routes = {
  '/': Search,
  '/forecast/:latitude/:longitude': Forecast,
  '/details/:latitude/:longitude/:date': Details,
  '*': Search,
};

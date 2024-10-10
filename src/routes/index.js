import SearchPage from './SearchPage.svelte';
import ForecastPage from './ForecastPage.svelte';
import DetailsPage from './DetailsPage.svelte';

export const routes = {
  '/': SearchPage,
  '/forecast/:latitude/:longitude': ForecastPage,
  '/details/:latitude/:longitude/:date': DetailsPage,
  '*': SearchPage,
};

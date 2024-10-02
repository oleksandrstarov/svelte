import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en-US', () => import('./en.json'));
register('ua-UA', () => import('./ua.json'));

init({
  fallbackLocale: 'en-US',
  initialLocale: getLocaleFromNavigator(),
});

import { writable } from 'svelte/store';

export const temperatureUnit = writable(localStorage.getItem('temperatureUnit') || 'c');

temperatureUnit.subscribe(temperatureUnit => {
  localStorage.setItem('temperatureUnit', temperatureUnit);
});

import { render, screen } from '@testing-library/svelte';
import { expect, test, beforeEach, describe } from 'vitest';
import App from './App.svelte';
import { isLoading } from 'svelte-i18n';
import { init, register, locale } from 'svelte-i18n';

beforeEach(() => {
  register('en', () => import('./i18n/en.json')); // Adjust to your locale path
  init({ fallbackLocale: 'en' });
  locale.set('en');
});

describe('App', () => {
  test('renders header, and notifications components when not loading', () => {
    isLoading.set(false);

    render(App);

    expect(screen.getByTestId('header-element')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-element')).toBeInTheDocument();
  });

  test('renders spinner when loading', async () => {
    isLoading.set(true);

    render(App);

    expect(screen.getByTestId('spinner-element')).toBeInTheDocument(); // Assuming your Spinner has a role of "status"
  });
});

import { render, screen } from '@testing-library/svelte';
import { expect, it, beforeEach, describe } from 'vitest';
import App from './App.svelte';
import { isLoading } from 'svelte-i18n';
import { init, register, locale } from 'svelte-i18n';

beforeEach(() => {
  register('en', () => import('./i18n/en.json'));
  init({ fallbackLocale: 'en' });
  locale.set('en');
});

describe('App', () => {
  it('should render header, and notifications components when not loading', () => {
    isLoading.set(false);

    render(App);

    expect(screen.getByTestId('header-element')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-element')).toBeInTheDocument();
  });

  it('should render spinner when loading', async () => {
    isLoading.set(true);

    render(App);

    expect(screen.getByTestId('spinner-element')).toBeInTheDocument(); // Assuming your Spinner has a role of "status"
  });
});

import { render, screen, waitFor } from '@testing-library/svelte';
import weatherService from '../services/weatherService';
import { expect, it, vi, describe, beforeEach } from 'vitest';
import { init, locale, register } from 'svelte-i18n';
import ForecastPage from './ForecastPage.svelte';

vi.mock('../services/weatherService'); // Mocking the weather service

beforeEach(() => {
  register('en', () => import('../i18n/en.json')); // Adjust to your locale path
  init({ fallbackLocale: 'en' });
  locale.set('en');
});

describe('ForecastPage Component', () => {
  it('getting forecast data then displays forecast', async () => {
    const mockWeatherData = {
      temperature: 20,
      feelsLike: 18,
      precipitation: 0.1,
      weatherCode: 100,
      windSpeed: 5,
      windDirection: 23,
      windGusts: 10,
      timeOfDayId: 1,
    };

    weatherService.getWeather.mockResolvedValueOnce(mockWeatherData);

    render(ForecastPage, {
      params: { latitude: 52.52, longitude: 13.405 },
    });

    const forecastPage = screen.getByTestId('forecast-page');

    expect(forecastPage).toBeInTheDocument();

    await waitFor(() => {
      expect(weatherService.getWeather).toHaveBeenCalledWith(52.52, 13.405);
    });

    expect(screen.getByTestId('forecast-main-banner')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-forecast')).toBeInTheDocument();
  });
});

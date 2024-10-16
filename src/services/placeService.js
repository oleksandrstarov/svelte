import { NOTIFICATION_TYPE, notificationsStore } from '../stores/notification';
import { t } from 'svelte-i18n';
import { get } from 'svelte/store';
import axios from '../utils/cachedAxios';

const env = import.meta.env;
const apiKey = env.VITE_GMAPS_API_KEY;
const rapidApiHost = 'google-map-places.p.rapidapi.com';

class PlacesService {
  #getUrl(name) {
    return env.VITE_NODE_ENV === 'production'
      ? `https://${rapidApiHost}/maps/api/place/${name}/json?key=${apiKey}`
      : `/place-api/${name}/json?key=${apiKey}`;
  }

  #getHeaders() {
    return {
      'x-rapidapi-host': rapidApiHost,
      'x-rapidapi-key': env.VITE_GMAPS_RAPID_API_KEY,
    };
  }

  async getAutocomplete(input) {
    try {
      const formattedInput = input.replace(/ /g, '%');
      const endpoint = `${this.#getUrl('autocomplete')}&input=${formattedInput}&types=locality`;

      const response = await axios.get(endpoint, { headers: { ...this.#getHeaders() } });

      return response.data.predictions.map(({ description, place_id }) => ({
        address: description,
        placeId: place_id,
      }));
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: get(t)('errors.getAutocomplete'),
      });
      console.error(e.message);
    }
  }

  async getDetails(placeId) {
    try {
      const endpoint = `${this.#getUrl('details')}&place_id=${placeId}`;

      const response = await axios.get(endpoint, { headers: { ...this.#getHeaders() } });

      return {
        location: response.data.result.geometry.location,
        address: response.data.result.formatted_address,
      };
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: get(t)('errors.getDetails'),
      });
      console.error(e.message);
    }
  }

  async getId(latitude, longitude) {
    try {
      const endpoint = `${this.#getUrl(
        'nearbysearch',
      )}&location=${latitude},${longitude}&radius=1000`;

      const response = await axios.get(endpoint, { headers: { ...this.#getHeaders() } });

      return response.data.results[0]?.place_id;
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: get(t)('errors.getDetails'),
      });
      console.error(e.message);
    }
  }

  async getSearch(query) {
    try {
      const endpoint = `${this.#getUrl('textsearch')}&query=${query}`;

      const response = await axios.get(endpoint, { headers: { ...this.#getHeaders() } });

      return response.data.results.reduce(
        (
          acc,
          {
            formatted_address,
            geometry: {
              location: { lat, lng },
            },
            place_id,
          },
        ) => {
          if (!acc.some(item => item.address === formatted_address)) {
            acc.push({ address: formatted_address, placeId: place_id, lat, lng });
          }

          return acc;
        },
        [],
      );
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: get(t)('errors.getSearch'),
      });
      console.error(e.message);
    }
  }
}

const placesService = new PlacesService();
export default placesService;

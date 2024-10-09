import { NOTIFICATION_TYPE, notificationsStore } from '../stores/notification';
import { t } from 'svelte-i18n';
import { get } from 'svelte/store';
import axios from '../utils/cachedAxios';

const env = import.meta.env;
const apiKey = env.VITE_GMAPS_API_KEY;

class PlacesService {
  #getUrl(name) {
    return env.VITE_NODE_ENV === 'production'
      ? `https://maps.googleapis.com/maps/api/place/${name}/json?key=${apiKey}`
      : `/place-api/${name}/json?key=${apiKey}`;
  }

  async getAutocomplete(input) {
    try {
      const formattedInput = input.replace(/ /g, '%');
      const endpoint = `${this.#getUrl(
        'autocomplete',
      )}&input=${formattedInput}&types=locality|sublocality`;

      const response = await axios.get(endpoint);

      return response.data.predictions.map(({ description, place_id }) => ({
        placeName: description,
        placeId: place_id,
      }));
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: `${get(t)('errors.getAutocomplete')}`,
      });
      console.error(e.message);
    }
  }

  async getDetails(placeId) {
    try {
      const endpoint = `${this.#getUrl('details')}&place_id=${placeId}`;

      const response = await axios.get(endpoint);

      return {
        location: response.data.result.geometry.location,
        address: response.data.result.formatted_address,
      };
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: `${get(t)('errors.getDetails')}`,
      });
      console.error(e.message);
    }
  }
  async getId(latitude, longitude) {
    try {
      const endpoint = `${this.#getUrl(
        'nearbysearch',
      )}&location=${latitude},${longitude}&radius=1000`;

      const response = await axios.get(endpoint);

      return response.data.results[0]?.place_id;
    } catch (e) {
      notificationsStore.addNotification({
        type: NOTIFICATION_TYPE.Error,
        message: `${get(t)('errors.getDetails')}`,
      });
      console.error(e.message);
    }
  }
}

const placesService = new PlacesService();
export default placesService;

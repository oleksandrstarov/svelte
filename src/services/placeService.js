import axios from '../utils/cachedAxiosInstanse';

const env = import.meta.env;
const apiKey = env.VITE_GMAPS_API_KEY;
const baseUrl = 'https://maps.googleapis.com/maps/api/place/';

class PlacesService {
  async getAutocomplete(input) {
    try {
      const autocompleteUrl =
        env.VITE_NODE_ENV === 'production' ? `${baseUrl}autocomplete/json` : '/autocomplete-api';

      const formattedInput = input.replace(new RegExp(' ', 'g'), '%');
      const endpoint = `${autocompleteUrl}?key=${apiKey}&input=${formattedInput}&types=geocode`;

      const response = await axios.get(endpoint);

      return response.data;
    } catch (e) {
      console.log(e.message);
    }
  }

  async getPlaceLocation(placeId) {
    try {
      const placeUrl =
        env.VITE_NODE_ENV === 'production' ? `${baseUrl}details/json` : '/details-api';

      const endpoint = `${placeUrl}?key=${apiKey}&place_id=${placeId}`;

      const response = await axios.get(endpoint);

      return response.data.result.geometry.location;
    } catch (e) {
      console.log(e.message);
    }
  }
}

const placesService = new PlacesService();
export default placesService;

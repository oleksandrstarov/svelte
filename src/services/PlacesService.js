import axios from 'axios';

const env = import.meta.env;
const apiKey = env.VITE_GMAPS_API_KEY;

class PlacesService {
  async getAutocomplete(location) {
    try {
      const autocomplete_url =
        env.VITE_NODE_ENV === 'production'
          ? 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
          : '/autocomplete-api';

      const query = location.replace(new RegExp(' ', 'g'), '%');
      const apiUrl = `${autocomplete_url}?key=${apiKey}&input=${query}&types=geocode`;
      const response = await axios.get(apiUrl);

      return response.data;
    } catch (e) {
      console.log(e.message);
    }
  }

  async getPlace(placeId) {
    try {
      const placeUrl =
        env.VITE_NODE_ENV === 'production'
          ? 'https://maps.googleapis.com/maps/api/place/details/json'
          : '/details-api';

      const apiUrl = `${placeUrl}?key=${apiKey}&place_id=${placeId}`;

      const response = await axios.get(apiUrl);

      return response.data;
    } catch (e) {
      console.log(e.message);
    }
  }
}

const placesService = new PlacesService();
export default placesService;

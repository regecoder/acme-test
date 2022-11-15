import axios from 'axios';
import config from '../core/config';

export default class WeatherService {
  static getCurrentWeather(args: WeatherLocation) {
    const { town, countryCode = config.weatherService.defaultCountryCode } =
      args;

    const url = config.weatherService.currentWeatherURL
      .replace('{city}', town)
      .replace('{country_code}', countryCode)
      .replace('{api_key}', config.weatherService.apiKey);

    return axios.get(url).then((res) => {
      const { main } = res.data.weather[0];
      const { temp } = res.data.main;
      return { main, temp };
    });
  }
}

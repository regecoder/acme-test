import dotenv from 'dotenv';

dotenv.config();

const httpServer = {
  host: String(process.env.SERVER_HOST),
  port: Number(process.env.SERVER_PORT)
};

const weatherService = {
  apiKey: String(process.env.OPENWEATHER_API_KEY),
  currentWeatherURL: String(process.env.OPENWEATHER_CURRENT_WEATHER_URL),
  defaultCountryCode: String(process.env.OPENWEATHER_DEFAULT_COUNTRY_CODE)
};

export default {
  httpServer,
  weatherService
};

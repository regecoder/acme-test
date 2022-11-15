type ValidatorResult = {
  isValid: boolean;
  reasons?: Array<string>;
};

type ValidatorConditions = {
  key: string;
  operator: string;
  promise?: Promise<ValidatorResult>;
  result?: ValidatorResult;
};

type ValidatorArgs = {
  age?: number;
  date?: string;
  meteo?: {
    town: string;
  };
};

type WeatherLocation = {
  town: string;
  countryCode?: string;
};

import WeatherService from '../weather/weather-service';

export default class PromocodeModel {
  public name: string;
  public avantage: object;
  public restrictions: Array<object>;

  constructor(data: PromocodeModel) {
    const { name, avantage, restrictions } = data;

    this.name = name;
    this.avantage = avantage;
    this.restrictions = restrictions;
  }

  validate(context: ValidatorArgs) {
    return this.validateRestrictions(this.restrictions, context);
  }

  async validateRestrictions(
    restrictions: Array<object>,
    context: ValidatorArgs
  ) {
    const conditions: Array<ValidatorConditions> = [];

    // Passe l'ensemble des restrictions du promocode en appelant la fonctions asynchrone associée à chaque type de restriction
    for (const restriction of restrictions) {
      const [key, value] = Object.entries(restriction)[0];

      switch (key) {
        case '@date': {
          const today = new Date().toISOString().slice(0, 10);
          conditions.push({
            key,
            operator: 'and',
            promise: PromocodeModel.validateDate(value, today)
          });
          break;
        }

        case '@age':
          conditions.push({
            key,
            operator: 'and',
            promise: PromocodeModel.validateAge(value, context.age)
          });
          break;

        case '@meteo':
          conditions.push({
            key,
            operator: 'and',
            promise: PromocodeModel.validateWeather(value, context.meteo)
          });
          break;

        // Appelle récursivement la fonction parente avec le tableau des restrictions correspondant
        case '@and':
          conditions.push({
            key,
            operator: 'and',
            // eslint-disable-next-line no-await-in-loop
            result: await this.validateRestrictions(value, context)
          });
          break;

        // Appelle récursivement la fonction parente avec le tableau des restrictions correspondant
        case '@or':
          conditions.push({
            key,
            operator: 'or',
            // eslint-disable-next-line no-await-in-loop
            result: await this.validateRestrictions(value, context)
          });
          break;

        default:
      }
    }

    // Associe les promesses à résoudre avec leur position dans le tableau des conditions
    const conditionPromises: Array<{
      index: number;
      promise?: Promise<ValidatorResult>;
    }> = [];

    for (let i = 0; i < conditions.length; i += 1) {
      if (conditions[i].promise) {
        conditionPromises.push({
          index: i,
          promise: conditions[i].promise
        });
      }
    }

    return Promise.allSettled(
      conditionPromises.map((item) => item.promise)
    ).then((results) => {
      // Met à jour le tableau des conditions avec le résultat des promesses résolues
      for (let i = 0; i < results.length; i += 1) {
        const { status } = results[i];
        let value;
        if (status === 'fulfilled') {
          ({ value } = results[i] as any);
        } else {
          value = {
            isValid: false,
            reasons: ['Unexpected error']
          };
        }
        conditions[conditionPromises[i].index].result = value;
      }

      let result;

      // Retourne accepté si une condition OR est acceptée
      const trueConditions = conditions.filter(
        (condition) =>
          condition.operator === 'or' &&
          condition.result &&
          condition.result.isValid
      );
      if (trueConditions.length > 0) {
        result = { isValid: true };
      }

      if (!result) {
        // Retourne refusé si une condition AND est refusée
        const falseConditions = conditions.filter((condition) => {
          // eslint-disable-next-line no-param-reassign
          condition.result = condition.result as ValidatorResult;
          return condition.operator === 'and' && !condition.result.isValid;
        });
        if (falseConditions.length > 0) {
          const reasons = [];
          for (const condition of conditions) {
            condition.result = condition.result as ValidatorResult;
            if (!condition.result.isValid) {
              reasons.push(...(condition.result.reasons as string[]));
            }
          }

          result = {
            isValid: false,
            reasons
          };
        }
      }

      if (!result) {
        // Retourne accepté si toutes les conditions sont acceptées
        result = { isValid: true };
      }

      return result;
    });
  }

  // Fonction de validation de la date
  static validateDate(restrictions: object, currentDate: string) {
    const reasons = [];

    if (!currentDate) {
      reasons.push('Date argument missing');
    } else {
      const entries = Object.entries(restrictions);

      for (const [key, value] of entries) {
        switch (key) {
          case 'after':
            if (currentDate < value) {
              reasons.push(`Date ${currentDate} doesn't match: after ${value}`);
            }
            break;
          case 'before':
            if (currentDate > value) {
              reasons.push(
                `Date ${currentDate} doesn't match: before ${value}`
              );
            }
            break;
          default:
            reasons.push(`Date restriction doesn't support ${key}`);
        }
      }
    }

    const res: ValidatorResult =
      reasons.length > 0
        ? {
            isValid: false,
            reasons
          }
        : {
            isValid: true
          };

    return Promise.resolve(res);
  }

  // Fonction de validation de l'âge
  static validateAge(restrictions: object, age: number | undefined) {
    const reasons = [];

    if (!age) {
      reasons.push('Age argument missing');
    } else {
      const entries = Object.entries(restrictions);

      for (const [key, value] of entries) {
        switch (key) {
          case 'eq':
            if (age !== value) {
              reasons.push(`Age ${age} doesn't match: eq ${value}`);
            }
            break;
          case 'lt':
            if (age > value) {
              reasons.push(`Age ${age} doesn't match: lt ${value}`);
            }
            break;
          case 'gt':
            if (age < value) {
              reasons.push(`Age ${age} doesn't match: gt ${value}`);
            }
            break;
          default:
            reasons.push(`Age restriction doesn't support ${key}`);
        }
      }
    }

    const res =
      reasons.length > 0
        ? {
            isValid: false,
            reasons
          }
        : {
            isValid: true
          };

    return Promise.resolve(res);
  }

  // Fonction de validation de la météo
  static async validateWeather(
    restrictions: object,
    args: { town: string } | undefined
  ) {
    const reasons = [];

    if (!(args && args.town)) {
      reasons.push('Weather argument missing');
    } else {
      let weather;
      try {
        weather = await WeatherService.getCurrentWeather(args);
      } catch (err) {
        return Promise.reject(err);
      }

      const entries = Object.entries(restrictions);

      for (const [key, value] of entries) {
        switch (key) {
          case 'is':
            if (weather.main.toUpperCase() !== value.toUpperCase()) {
              reasons.push(
                `Weather main ${weather.main} doesn't match: is ${value}`
              );
            }
            break;

          case 'temp': {
            const tempEntries = Object.entries(value);

            for (const [tempKey, tempValue] of tempEntries) {
              switch (tempKey) {
                case 'gt':
                  if (weather.temp < Number(tempValue)) {
                    reasons.push(
                      `Weather temp ${weather.temp} doesn't match: gt ${tempValue}`
                    );
                  }
                  break;
                case 'lt':
                  if (weather.temp > Number(tempValue)) {
                    reasons.push(
                      `Weather temp ${weather.temp} doesn't match: lt ${tempValue}`
                    );
                  }
                  break;
                default:
                  reasons.push(
                    `Weather temp restriction doesn't support ${key}`
                  );
              }
            }
            break;
          }

          default:
            reasons.push(`Weather restriction doesn't support ${key}`);
        }
      }
    }

    const res =
      reasons.length > 0
        ? {
            isValid: false,
            reasons
          }
        : {
            isValid: true
          };

    return Promise.resolve(res);
  }
}

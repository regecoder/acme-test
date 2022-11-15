import PromocodeModel from './promocode-model';

export default class PromocodeService {
  static add(promocodes: Array<PromocodeModel>, data: string) {
    const promocode = JSON.parse(data);

    return new Promise((resolve, reject) => {
      if (promocodes.map((item) => item.name).includes(promocode.name)) {
        reject(new Error('Promocode already exists'));
        return;
      }

      const newPromocode = new PromocodeModel(promocode);

      promocodes.push(newPromocode);
      resolve(newPromocode);
    });
  }

  static validate(promocodes: Array<PromocodeModel>, data: string) {
    const request = JSON.parse(data);

    return new Promise((resolve, reject) => {
      const name = request.promocode_name;
      const index = promocodes.map((item) => item.name).indexOf(name);

      if (index === -1) {
        reject(new Error('Promocode not found'));
        return;
      }

      const promocode = promocodes[index];

      promocode
        .validate(request.arguments)
        .then(({ isValid, reasons }: ValidatorResult) => {
          let res;
          if (isValid) {
            res = {
              promocode_name: name,
              status: 'accepted',
              avantage: promocode.avantage
            };
          } else {
            res = {
              promocode_name: name,
              status: 'denied',
              reasons
            };
          }
          resolve(res);
        });
    });
  }
}

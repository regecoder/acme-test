import PromocodeModel from '../promocode-model';

describe('PromocodeModel', () => {
  describe('validateDate method', () => {
    test('returns accepted validation when current date matches after restriction', async () => {
      const restrictions = {
        after: '2019-01-01'
      };
      const currentDate = '2019-01-01';

      const result = await PromocodeModel.validateDate(
        restrictions,
        currentDate
      );

      expect(result).toEqual({
        isValid: true
      });
    });

    test("returns denied validation when current date doesn't matches after restriction", async () => {
      const restrictions = {
        after: '2019-01-01'
      };
      const currentDate = '2018-12-31';

      const result = await PromocodeModel.validateDate(
        restrictions,
        currentDate
      );

      expect(result).toEqual(
        expect.objectContaining({
          isValid: false
        })
      );
    });

    test('returns accepted validation when current date matches before restriction', async () => {
      const restrictions = {
        before: '2019-01-01'
      };
      const currentDate = '2019-01-01';

      const result = await PromocodeModel.validateDate(
        restrictions,
        currentDate
      );

      expect(result).toEqual({
        isValid: true
      });
    });

    test("returns denied validation when current date doesn't matches before restriction", async () => {
      const restrictions = {
        before: '2019-01-01'
      };
      const currentDate = '2019-01-02';

      const result = await PromocodeModel.validateDate(
        restrictions,
        currentDate
      );

      expect(result).toEqual(
        expect.objectContaining({
          isValid: false
        })
      );
    });
  });
});

import express from 'express';
import PromocodeService from './promocode-service';

const router = express.Router();

export default router;

router.post('/validate', (req, res) => {
  const { data } = req.body;

  PromocodeService.validate(req.app.locals.promocodes, data)
    .then((response) => {
      res.json(response);
    })
    .catch((err: Error) => {
      res.status(500).json({
        status: 500,
        message: err.message
      });
    });
});

router.post('/', (req, res) => {
  const { data } = req.body;

  if (!data) {
    res.status(400).json({
      status: 400,
      message: 'Promocode not found'
    });
    return;
  }

  PromocodeService.add(req.app.locals.promocodes, data)
    .then((promocode) => {
      res.json({
        promocode
      });
    })
    .catch((err: Error) => {
      res.status(400).json({
        status: 400,
        message: err.message
      });
    });
});

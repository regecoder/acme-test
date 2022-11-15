import express from 'express';
import promocodeController from '../promocode/promocode-controller';

const router = express.Router();

export default router;

router.use('/promocode', promocodeController);

router.use((req, res, next) => {
  next(new Error('Resource not found'));
});

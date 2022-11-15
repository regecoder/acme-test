import express from 'express';
import handleError from '../lib/error-handler';
import router from './router';

const app = express();

export default app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.promocodes = [];

app.use('/', router);

app.use(handleError);

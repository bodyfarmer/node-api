import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';

import expressValidation from 'express-validation';
import httpStatus from 'http-status';
import APIError from './server/helpers/APIError';
import cors from 'cors';
import mongoose from 'mongoose';
// set bluebird default Promise
import Promise from 'bluebird';
//config
import {} from 'dotenv/config';

const app = express();
app.disable('x-powered-by');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongodb
mongoose.connect(`${process.env.MONGODB_URL}`, {});
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database`);
});

// serve angular app from this directory
app.use(express.static(path.join(__dirname, '../public')));
// mount all routes on /api path
app.use('/api', routes);

// Error handler
// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. '))
      .join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

export default app;

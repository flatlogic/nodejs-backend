import jwt from 'jsonwebtoken';
import config from './config/config.js';

export function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

export function commonErrorHandler(error, req, res, next) {
  if ([400, 403, 404].includes(error.code)) {
    return res.status(error.code).send(error.message);
  }

  console.error(error);
  return res.status(500).send(error.message);
}

export function jwtSign(data) {
  return jwt.sign(data, config.secret_key, { expiresIn: '6h' });
}

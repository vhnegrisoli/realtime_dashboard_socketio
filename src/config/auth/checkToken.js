import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import * as auth from './authKey';

const bearer = 'bearer ';

export default async (req, res, next) => {
  const { authorization } = req.headers;
  const url = req.url;
  if (!url.includes('api')) {
    return next();
  }
  if (!authorization || !authorization.toLowerCase().includes(bearer)) {
    return res.redirect('login');
  }
  const token = authorization.split(' ')[1];
  try {
    const decoded = await promisify(jwt.verify)(token, auth.apiKey);
    req.authUser = decoded.authUser;
    return next();
  } catch (error) {
    return res.redirect('login');
  }
};

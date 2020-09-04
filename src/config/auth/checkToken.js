import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import * as auth from './authKey';

const bearer = 'bearer ';

export default async (req, res, next) => {
  const { authorization } = req.headers;
  const url = req.url;
  let token = null;
  if (url.includes('api')) {
    if (!authorization || !authorization.toLowerCase().includes(bearer)) {
      return res.redirect('/login');
    }
    token = authorization.split(' ')[1];
  } else {
    if (!req.cookies.token) {
      return res.redirect('/login');
    }
    token = req.cookies.token;
  }
  if (!token || token === '') {
    res.redirect('/login');
  }
  try {
    const decoded = await promisify(jwt.verify)(token, auth.apiKey);
    req.authUser = decoded.authUser;
    return next();
  } catch (error) {
    return res.redirect('/login');
  }
};

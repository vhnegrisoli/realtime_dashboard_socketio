import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  promisify
} from 'util';
import * as auth from '../../../config/auth/authKey';

import Usuario from '../model/Usuario';

class AuthController {
  async auth(req, res) {
    try {
      const {
        email,
        senha
      } = req.body;
      const usuario = await Usuario.findOne({
        email
      });
      if (!usuario) {
        return res.status(400).json({
          message: 'O email ' + email + ' não foi encontrado.'
        });
      }
      if (await bcrypt.compare(senha, usuario.senha)) {
        const {
          id,
          email,
          nome,
          permissoes
        } = usuario;
        let accessToken = jwt.sign({
          authUser: {
            id,
            email,
            nome,
            permissoes
          }
        }, auth.apiKey, {
          expiresIn: '1d',
        });
        return res.json({
          userId: id,
          accessToken
        });
      }
      return res.status(401).json({
        message: 'A senha está incorreta.'
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async checkToken(req, res) {
    const {
      token
    } = req.query;
    if (!token) {
      return res.status(401).json({
        message: 'Usuário não autenticado.'
      });
    }
    try {
      await promisify(jwt.verify)(token, auth.apiKey);
      return res.json({
        message: 'Token autenticada.'
      });
    } catch (error) {
      return res.status(401).json({
        message: 'Usuário não autenticado.'
      });
    }
  }

  async getAuthUser(req, res) {
    const {
      authUser
    } = req;
    return res.json(authUser);
  }

  async iniciarLogin(req, res) {
    res.render('login');
  }
}
export default new AuthController();
import Usuario from '../model/Usuario';

class UsuarioController {
  async inicializarFormularioUsuario(req, res) {
    return res.render('usuarios/cadastrar');
  }

  async salvarUsuario(req, res) {
    try {
      const { nome, email, senha, confirmarSenha, permissao } = req.body;
      if (!nome || !email || !senha || !confirmarSenha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
      if (senha !== confirmarSenha) {
        return res.status(400).json({ message: 'As senhas não estão iguais.' });
      }
      const usuarioExistente = await Usuario.findOne({ email });
      const permissoes = [permissao];
      if (usuarioExistente) {
        return res.status(400).json({ message: 'Usuário já existente.' });
      }
      const usuario = await Usuario.create({ nome, email, senha, permissoes });
      return res.json(usuario);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async editarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const _id = id.toString();
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente && String(usuarioExistente._id) !== String(_id)) {
        return res.status(400).json({ message: 'Usuário já existente.' });
      }
      const usuario = await Usuario.create(req.body);
      return res.json(usuario);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async buscarTodosUsuarios(req, res) {
    try {
      const usuarios = await Usuario.find();
      return res.json(usuarios);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async buscarUsuarioPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        res.status(400).json({ message: 'O usuário não foi encontrado.' });
      }
      return res.json(usuario);
    } catch (error) {
      return res.status(400).json({ message: 'O usuário não foi encontrado.' });
    }
  }
}
export default new UsuarioController();

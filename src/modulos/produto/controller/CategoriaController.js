import Categoria from '../model/Categoria';

class CategoriaController {
  async iniciarFormularioCategoria(req, res) {
    res.render('categorias/cadastrar');
  }

  async buscarCategorias(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const categorias = await Categoria.find({ descricao: { $exists: true }, usuarioId });
    const categoriasResponse = [];
    categorias.map((categoria) => {
      categoriasResponse.push({
        id: categoria._id,
        descricao: categoria.descricao,
        usuarioId,
      });
    });
    res.render('categorias/listar', {
      categorias: categoriasResponse,
    });
  }

  async buscarTodasCategorias(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const categorias = await Categoria.find({ usuarioId });
    return res.json(categorias);
  }

  async buscarCategoria(req, res) {
    const { id } = req.params;
    const { authUser } = req;
    const usuarioId = authUser.id;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    const categoria = await Categoria.findOne({ _id: id, usuarioId });
    if (!categoria) {
      return res.status(400).json({ message: 'A categoria não foi encontrada.' });
    }
    return res.json(categoria);
  }

  async salvarCategoria(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { descricao } = req.body;
    const categoria = await Categoria.findOne({ descricao, usuarioId });
    if (!descricao) {
      return res.status(400).json({ message: 'A descrição da categoria é obrigatória.' });
    }
    if (categoria) {
      return res.status(400).json({ message: 'Esta categoria já está cadastrada.' });
    }
    try {
      const novaCategoria = await Categoria.create({ descricao, usuarioId });
      return res.json(novaCategoria);
    } catch (error) {
      return res.status(400).json({ message: 'Houve um erro ao salvar a categoria.' });
    }
  }

  async editarCategoria(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    const { descricao } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    if (!descricao) {
      return res.status(400).json({ message: 'A descrição da categoria é obrigatória.' });
    }
    const categoriaDescricao = await Categoria.findOne({ descricao, usuarioId });
    const categoria = await Categoria.findById(id);
    if (
      !categoriaDescricao ||
      (categoriaDescricao &&
        descricao === categoriaDescricao.descricao &&
        String(id) !== String(categoriaDescricao._id))
    ) {
      return res.status(400).json({ message: 'Esta categoria já está cadastrada.' });
    }
    categoria.descricao = descricao;
    try {
      await categoria.save();
      return res.json('A categoria foi atualizada com sucesso!');
    } catch (error) {
      return res.status(400).json({ message: 'Houve um erro ao editar a categoria.' });
    }
  }

  async removerCategoria(req, res) {
    const { id } = req.params;
    const { authUser } = req;
    const usuarioId = authUser.id;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    try {
      const categoriaExistente = await Categoria.findOne({ _id: id, usuarioId });
      if (!categoriaExistente) {
        return res.status(400).json('Você não tem permissão para remover esta categoria.');
      }
      await Categoria.findByIdAndRemove(id);
      return res.json('A categoria foi removida com sucesso!');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao remover a categoria.' });
    }
  }
}

export default new CategoriaController();

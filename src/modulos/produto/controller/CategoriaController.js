import Categoria from "../model/Categoria";

class CategoriaController {
  async iniciarFormularioCategoria(req, res) {
    res.render("categorias/cadastrar");
  }

  async buscarCategorias(req, res) {
    const categorias = await Categoria.find({ descricao: { $exists: true } });
    const categoriasResponse = [];
    categorias.map((categoria) => {
      categoriasResponse.push({
        id: categoria._id,
        descricao: categoria.descricao,
      });
    });
    res.render("categorias/listar", {
      categorias: categoriasResponse,
    });
  }

  async buscarTodasCategorias(req, res) {
    const categorias = await Categoria.find();
    return res.json(categorias);
  }

  async buscarCategoria(req, res) {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "A categoria não foi encontrada" });
    }
    const categoria = await Categoria.findById(id);
    return res.json(categoria);
  }

  async salvarCategoria(req, res) {
    const { descricao } = req.body;
    const categoria = await Categoria.findOne({ descricao });
    if (!descricao) {
      return res
        .status(400)
        .json({ message: "A descrição da categoria é obrigatória." });
    }
    if (categoria) {
      return res
        .status(400)
        .json({ message: "Esta categoria já está cadastrada." });
    }
    try {
      const novaCategoria = await Categoria.create({ descricao });
      return res.json(novaCategoria);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Houve um erro ao salvar a categoria." });
    }
  }

  async editarCategoria(req, res) {
    const { id } = req.params;
    const { descricao } = req.body;
    if (!id) {
      return res.status(400).json({ message: "O id é obrigatório." });
    }
    if (!descricao) {
      return res
        .status(400)
        .json({ message: "A descrição da categoria é obrigatória." });
    }
    const categoriaDescricao = await Categoria.findOne({ descricao });
    const categoria = await Categoria.findById(id);
    if (
      categoriaDescricao &&
      descricao === categoriaDescricao.descricao &&
      String(id) !== String(categoriaDescricao._id)
    ) {
      return res
        .status(400)
        .json({ message: "Esta categoria já está cadastrada." });
    }
    categoria.descricao = descricao;
    try {
      await categoria.save();
      return res.json("A categoria foi atualizada com sucesso!");
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Houve um erro ao editar a categoria." });
    }
  }

  async removerCategoria(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "O id é obrigatório." });
    }
    try {
      await Categoria.findByIdAndRemove(id);
      return res.json("A categoria foi removida com sucesso!");
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ message: "Houve um erro ao remover a categoria." });
    }
  }
}

export default new CategoriaController();

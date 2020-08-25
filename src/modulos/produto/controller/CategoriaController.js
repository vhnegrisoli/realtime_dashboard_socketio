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

  async salvarCategoria(req, res) {
    const { descricao } = req.body;
    const categoria = await Categoria.findOne({ descricao });
    if (categoria) {
      console.log(categoria);
      return res
        .status(400)
        .json({ message: "Esta categoria já está cadastrada." });
    }
    const novaCategoria = await Categoria.create({ descricao });
    return res.json(novaCategoria);
  }
}

export default new CategoriaController();

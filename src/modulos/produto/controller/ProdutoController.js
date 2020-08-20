import Produto from "../model/Produto";

class ProdutoController {
  async buscarTodos(req, res) {
    const produtos = await Produto.find();
    return res.json(produtos);
  }

  async salvarVarios(req, res) {
    await Produto.insertMany(req.body.produtos);
    return res.json({ message: "Os produtos foram inseridos com sucesso!" });
  }
}
export default new ProdutoController();

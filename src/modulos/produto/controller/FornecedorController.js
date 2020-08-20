import Fornecedor from "../model/Fornecedor";

class FornecedorController {
  async buscarTodos(req, res) {
    const fornecedores = await Fornecedor.find();
    return res.json(fornecedores);
  }

  async salvarVarios(req, res) {
    await Fornecedor.insertMany(req.body.fornecedores);
    return res.json({
      message: "Os fornecedores foram inseridos com sucesso!",
    });
  }
}
export default new FornecedorController();

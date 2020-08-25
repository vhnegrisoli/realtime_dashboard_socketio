import * as io from "../../../config/socket/index";

import Venda from "../model/Venda";
import Produto from "../../produto/model/Produto";
import DashboardController from "../../dashboard/controller/DashboardController";

class VendaController {
  async buscarTodas(req, res) {
    const vendas = await Venda.find();
    return res.json(vendas);
  }

  async salvarVarias(req, res) {
    await Venda.insertMany(req.body.vendas);
    const qtdVendas = Venda.find().count();
    return res.json({
      message: "Foram inseridas " + qtdVendas + " vendas com sucesso!",
    });
  }

  async iniciarFormulario(req, res) {
    const produtos = await Produto.find();
    const produtosResponse = [];
    produtos.forEach((produto) => {
      produtosResponse.push({
        _id: `${produto._id}preco${produto.valorVenda}`,
        produto: `${produto.produto} - R$${produto.valorVenda}`,
      });
    });
    res.render("vendas/cadastrar", {
      produtos: produtosResponse,
      aprovacoes: ["APROVADA", "REJEITADA", "AGUARDANDO_APROVACAO"],
      situacoes: ["FECHADA", "ABERTA"],
    });
  }

  async salvarVenda(req, res) {
    const { produtoId, data, situacao, aprovacao, quantidade } = req.body;
    const produtoExistente = await Produto.findById(produtoId);
    const {
      produto,
      categoria,
      fornecedorCnpj,
      fornecedorRazaoSocial,
      valorVenda,
    } = produtoExistente;
    const valorTotalVenda = (valorVenda * quantidade).toFixed(2);
    const vendaSalva = await Venda.create({
      produto: produto,
      categoria,
      fornecedorRazaoSocial,
      fornecedorCnpj,
      dataVenda: data,
      quantidade,
      valorVenda: valorTotalVenda,
      situacao,
      aprovacao,
    });
    await DashboardController.atualizarDados(req, res);
    return res.json(vendaSalva);
  }
}
export default new VendaController();

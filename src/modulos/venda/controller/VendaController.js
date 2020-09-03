import * as io from '../../../config/socket/index';

import Venda from '../model/Venda';
import Produto from '../../produto/model/Produto';
import DashboardController from '../../dashboard/controller/dashboardController';

class VendaController {
  async buscarTodas(req, res) {
    const vendas = await Venda.find();
    return res.json(vendas);
  }

  async salvarVarias(req, res) {
    await Venda.insertMany(req.body.vendas);
    const qtdVendas = Venda.find().count();
    return res.json({
      message: 'Foram inseridas ' + qtdVendas + ' vendas com sucesso!',
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
    res.render('vendas/cadastrar', {
      produtos: produtosResponse,
      aprovacoes: ['APROVADA', 'REJEITADA', 'AGUARDANDO_APROVACAO'],
      situacoes: ['FECHADA', 'ABERTA'],
    });
  }

  async salvarVenda(req, res) {
    const controller = new VendaController();
    controller.validarDadosVenda(req.body, res);
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { produtoId, data, situacao, aprovacao, quantidade } = req.body;
    const produtoExistente = await Produto.findById(produtoId);
    if (!produtoExistente) {
      return res.status(400).json({ message: 'O produto não foi encontrado.' });
    }
    const {
      produto,
      categoria,
      fornecedorCnpj,
      fornecedorRazaoSocial,
      valorVenda,
    } = produtoExistente;
    const valorTotalVenda = (valorVenda * quantidade).toFixed(2);
    try {
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
        usuarioId,
      });
      await DashboardController.atualizarDados(usuarioId);
      return res.json(vendaSalva);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao salvar a venda.' });
    }
  }

  validarDadosVenda(dados, res) {
    if (
      !dados.produtoId ||
      !dados.data ||
      !dados.situacao ||
      !dados.aprovacao ||
      !dados.quantidade
    ) {
      return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }
    if (dados.quantidade <= 0) {
      return res.status(400).json({ message: 'A quantidade não pode ser menor ou igual a 0.' });
    }
  }
}
export default new VendaController();

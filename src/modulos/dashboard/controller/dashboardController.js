import * as io from "./../../../config/socket/index";

import fs from "fs";
import Categoria from "../../produto/model/Categoria";
import Fornecedor from "../../produto/model/Fornecedor";
import Produto from "../../produto/model/Produto";
import Venda from "../../venda/model/Venda";
import * as util from "../util/util";

class DashboardController {
  async inserirDadosIniciais(req, res) {
    const controller = new DashboardController();
    const dados = controller.recuperarArquivoJson(res);
    await controller.removerCollectionsSeExistirem();
    await controller.inserirDadosIniciaisNasCollections(dados);
    await controller.atualizarDados();
    return res
      .status(201)
      .json({ message: "Todos os dados iniciais foram inseridos!" });
  }

  recuperarArquivoJson(res) {
    try {
      return JSON.parse(fs.readFileSync("dados_iniciais.json"));
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ message: "Houve um erro ao processar o arquivo." });
    }
  }

  async removerCollectionsSeExistirem() {
    if (await Categoria.countDocuments()) {
      await Categoria.collection.drop();
    }
    if (await Fornecedor.countDocuments()) {
      await Fornecedor.collection.drop();
    }
    if (await Produto.countDocuments()) {
      await Produto.collection.drop();
    }
    if (await Venda.countDocuments()) {
      await Venda.collection.drop();
    }
  }

  async inserirDadosIniciaisNasCollections(dados) {
    const { vendas, produtos, categorias, fornecedores } = dados;
    if (!vendas || !produtos || !categorias || !fornecedores) {
      return res
        .status(400)
        .json({ message: "É necessário informar todos os Models" });
    }
    await Categoria.insertMany(categorias);
    await Fornecedor.insertMany(fornecedores);
    await Produto.insertMany(produtos);
    await Venda.insertMany(vendas);
  }

  async recuperarIndicadoresDosCards(req, res) {
    const controller = new DashboardController();
    const dados = await controller.buscarIndicadoresDosCards();
    return res.json(dados);
  }

  async buscarIndicadoresDosCards() {
    const vendasFinalizadas = await Venda.countDocuments({
      situacao: "FECHADA",
    });
    const vendasAbertas = await Venda.countDocuments({
      situacao: "ABERTA",
    });
    const vendasAprovadas = await Venda.countDocuments({
      aprovacao: "APROVADA",
    });
    const vendasRejeitadas = await Venda.countDocuments({
      aprovacao: "REJEITADA",
    });
    return {
      card1: vendasFinalizadas,
      card2: vendasAbertas,
      card3: vendasAprovadas,
      card4: vendasRejeitadas,
    };
  }

  async getIndicadores(req, res) {
    const controller = new DashboardController();
    return res.json({
      vendasMensais: await controller.buscarIndicadorVendasMensais(),
      vendasMensaisPorValorVenda: await controller.buscarIndicadorVendasMensaisPorValorVenda(),
      vendasPorProdutos: await controller.buscarIndicadorVendasPorProdutos(),
      vendasPorFornecedores: await controller.buscarIndicadorVendasPorFornecedores(),
      vendasPorCategorias: await controller.buscarIndicadorVendasPorCategorias(),
      vendasPorSituacoes: await controller.buscarIndicadorVendasPorSituacoes(),
      vendasPorAprovacoes: await controller.buscarIndicadorVendasPorAprovacoes(),
    });
  }

  async buscarIndicadorVendasMensais() {
    const vendasMensais = await Venda.aggregate([
      {
        $group: {
          _id: {
            $substr: ["$dataVenda", 5, 2],
          },
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    util.formatarDiaMesParaMesAbreviado(vendasMensais);
    return vendasMensais;
  }

  async buscarIndicadorVendasMensaisPorValorVenda() {
    const vendasMensais = await Venda.aggregate([
      {
        $group: {
          _id: {
            $substr: ["$dataVenda", 5, 2],
          },
          value: { $sum: "$valorVenda" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    util.formatarDiaMesParaMesAbreviado(vendasMensais);
    util.formatarValoresParaDuasCasasDecimais(vendasMensais);
    return vendasMensais;
  }

  async buscarIndicadorVendasPorProdutos() {
    const vendasPorProdutos = await Venda.aggregate([
      {
        $group: {
          _id: "$produto",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          value: 1,
        },
      },
    ]);
    return vendasPorProdutos;
  }

  async buscarIndicadorVendasPorFornecedores() {
    const vendasPorFornecedores = await Venda.aggregate([
      {
        $group: {
          _id: "$fornecedorRazaoSocial",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          value: 1,
        },
      },
    ]);
    return vendasPorFornecedores;
  }

  async buscarIndicadorVendasPorCategorias() {
    const vendasPorCategorias = await Venda.aggregate([
      {
        $group: {
          _id: "$categoria",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          value: 1,
        },
      },
    ]);
    return vendasPorCategorias;
  }

  async buscarIndicadorVendasPorSituacoes() {
    const vendasPorSituacoes = await Venda.aggregate([
      {
        $group: {
          _id: "$situacao",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          value: 1,
        },
      },
    ]);
    return vendasPorSituacoes;
  }

  async buscarIndicadorVendasPorAprovacoes() {
    const vendasPorAprovacoes = await Venda.aggregate([
      {
        $group: {
          _id: "$aprovacao",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          value: 1,
        },
      },
    ]);
    return vendasPorAprovacoes;
  }

  async iniciarDashboard(req, res) {
    return res.render("dashboard");
  }

  async _atualizarDados(req, res) {
    const { _ids, data } = req.body;
    const controller = new DashboardController();
    const cards = await controller.buscarIndicadoresDosCards();
    const vendasMensais = await controller.buscarIndicadorVendasMensais();
    let values = {
      vendasMensais,
      cards,
    };
    const socketIO = io.getSocket();
    socketIO.emit("dados", values);
    return res.json({ message: "Enviado!" });
  }

  async atualizarDados() {
    const controller = new DashboardController();
    let values = {
      vendasMensais: await controller.buscarIndicadorVendasMensais(),
      vendasMensaisPorValorVenda: await controller.buscarIndicadorVendasMensaisPorValorVenda(),
      vendasPorProdutos: await controller.buscarIndicadorVendasPorProdutos(),
      vendasPorFornecedores: await controller.buscarIndicadorVendasPorFornecedores(),
      vendasPorCategorias: await controller.buscarIndicadorVendasPorCategorias(),
      vendasPorSituacoes: await controller.buscarIndicadorVendasPorSituacoes(),
      vendasPorAprovacoes: await controller.buscarIndicadorVendasPorAprovacoes(),
      cards: await controller.buscarIndicadoresDosCards(),
    };
    const socketIO = io.getSocket();
    socketIO.emit("dados", values);
  }

  novosDados(req, res) {
    return res.render("dashboard", {
      card1: 0,
      card2: 0,
      card3: 0,
      card4: 0,
    });
  }

  iniciarFormulario(req, res) {
    return res.render("main");
  }
}
export default new DashboardController();

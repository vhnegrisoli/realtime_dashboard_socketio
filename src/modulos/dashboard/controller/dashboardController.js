import * as io from "./../../../config/socket/index";

import fs from "fs";
import Categoria from "../../produto/model/Categoria";
import Fornecedor from "../../produto/model/Fornecedor";
import Produto from "../../produto/model/Produto";
import Venda from "../../venda/model/Venda";

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
          count: {
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
    vendasMensais.forEach((venda) => {
      if (venda._id === "01") {
        venda._id = "Jan";
      }
      if (venda._id === "02") {
        venda._id = "Fev";
      }
      if (venda._id === "03") {
        venda._id = "Mar";
      }
      if (venda._id === "04") {
        venda._id = "Abr";
      }
      if (venda._id === "05") {
        venda._id = "Mai";
      }
      if (venda._id === "06") {
        venda._id = "Jun";
      }
      if (venda._id === "07") {
        venda._id = "Jul";
      }
      if (venda._id === "08") {
        venda._id = "Ago";
      }
      if (venda._id === "09") {
        venda._id = "Set";
      }
      if (venda._id === "10") {
        venda._id = "Out";
      }
      if (venda._id === "11") {
        venda._id = "Nov";
      }
      if (venda._id === "12") {
        venda._id = "Dez";
      }
    });
    return vendasMensais;
  }

  async buscarIndicadorVendasPorProdutos() {
    const vendasPorProdutos = await Venda.aggregate([
      {
        $group: {
          _id: "$produto",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: 1,
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
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: 1,
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
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: 1,
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
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: 1,
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
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: 1,
        },
      },
    ]);
    return vendasPorAprovacoes;
  }

  async iniciarDashboard(req, res) {
    return res.render("dashboard");
  }

  async _atualizarDados(req, res) {
    const { labels, data } = req.body;
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

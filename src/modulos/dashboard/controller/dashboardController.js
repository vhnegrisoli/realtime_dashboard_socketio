import * as io from "./../../../config/socket/index";

import fs from "fs";
import Categoria from "../../produto/model/Categoria";
import Fornecedor from "../../produto/model/Fornecedor";
import Produto from "../../produto/model/Produto";
import Venda from "../../venda/model/Venda";
import Usuario from "../../usuario/model/Usuario";
import * as util from "../util/util";

class DashboardController {
  async reiniciarDados(req, res) {
    const controller = new DashboardController();
    const dados = controller.recuperarArquivoJson(res);
    await controller.removerCollectionsSeExistirem();
    await controller.inserirDadosIniciaisNasCollections(dados);
    return res.redirect("login");
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
    if (await Usuario.countDocuments()) {
      await Usuario.collection.drop();
    }
  }

  async inserirDadosIniciaisNasCollections(dados) {
    const { vendas, produtos, categorias, fornecedores } = dados;
    if (!vendas || !produtos || !categorias || !fornecedores) {
      return res
        .status(400)
        .json({ message: "É necessário informar todos os Models" });
    }
    const usuario = await Usuario.create({
      nome: "Usuário 1",
      email: "usuario@gmail.com",
      senha: "123456",
      permissoes: ["ADMIN"],
    });
    await Usuario.create({
      nome: "Usuário 2",
      email: "usuario2@gmail.com",
      senha: "123456",
      permissoes: ["ADMIN"],
    });
    categorias.forEach((categoria) => {
      categoria.usuarioId = usuario.id;
    });
    fornecedores.forEach((fornecedor) => {
      fornecedor.usuarioId = usuario.id;
    });
    produtos.forEach((produto) => {
      produto.usuarioId = usuario.id;
    });
    vendas.forEach((venda) => {
      venda.usuarioId = usuario.id;
    });
    await Categoria.insertMany(categorias);
    await Fornecedor.insertMany(fornecedores);
    await Produto.insertMany(produtos);
    await Venda.insertMany(vendas);
  }

  async recuperarIndicadoresDosCards(req, res) {
    const controller = new DashboardController();
    const { authUser } = req;
    const dados = await controller.buscarIndicadoresDosCards(authUser.id);
    return res.json(dados);
  }

  async buscarIndicadoresDosCards(usuarioId) {
    const vendasFinalizadas = await Venda.countDocuments({
      situacao: "FECHADA",
      usuarioId,
    });
    const vendasAbertas = await Venda.countDocuments({
      situacao: "ABERTA",
      usuarioId,
    });
    const vendasAprovadas = await Venda.countDocuments({
      aprovacao: "APROVADA",
      usuarioId,
    });
    const vendasRejeitadas = await Venda.countDocuments({
      aprovacao: "REJEITADA",
      usuarioId,
    });
    return {
      card1: vendasFinalizadas,
      card2: vendasAbertas,
      card3: vendasAprovadas,
      card4: vendasRejeitadas,
    };
  }

  async getIndicadores(req, res) {
    const { authUser } = req;
    const controller = new DashboardController();
    const usuarioId = String(authUser.id);
    return res.json({
      vendasMensais: await controller.buscarIndicadorVendasMensais(usuarioId),
      vendasMensaisPorValorVenda: await controller.buscarIndicadorVendasMensaisPorValorVenda(
        usuarioId
      ),
      vendasPorProdutos: await controller.buscarIndicadorVendasPorProdutos(
        usuarioId
      ),
      vendasPorFornecedores: await controller.buscarIndicadorVendasPorFornecedores(
        usuarioId
      ),
      vendasPorCategorias: await controller.buscarIndicadorVendasPorCategorias(
        usuarioId
      ),
      vendasPorSituacoes: await controller.buscarIndicadorVendasPorSituacoes(
        usuarioId
      ),
      vendasPorAprovacoes: await controller.buscarIndicadorVendasPorAprovacoes(
        usuarioId
      ),
    });
  }

  async buscarIndicadorVendasMensais(usuarioId) {
    const vendasMensais = await Venda.aggregate([
      {
        $match: {
          usuarioId: usuarioId,
        },
      },
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

  async buscarIndicadorVendasMensaisPorValorVenda(usuarioId) {
    const vendasMensais = await Venda.aggregate([
      {
        $match: {
          usuarioId: usuarioId,
        },
      },
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

  async buscarIndicadorVendasPorProdutos(usuarioId) {
    const vendasPorProdutos = await Venda.aggregate([
      {
        $match: {
          usuarioId: usuarioId,
        },
      },
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

  async buscarIndicadorVendasPorFornecedores(usuarioId) {
    const vendasPorFornecedores = await Venda.aggregate([
      {
        $match: {
          usuarioId: usuarioId,
        },
      },
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

  async buscarIndicadorVendasPorCategorias(usuarioId) {
    const vendasPorCategorias = await Venda.aggregate([
      {
        $match: {
          usuarioId: usuarioId,
        },
      },
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

  async buscarIndicadorVendasPorSituacoes(usuarioId) {
    const vendasPorSituacoes = await Venda.aggregate([
      {
        $match: {
          usuarioId: usuarioId,
        },
      },
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

  async buscarIndicadorVendasPorAprovacoes(usuarioId) {
    const vendasPorAprovacoes = await Venda.aggregate([
      {
        $match: {
          usuarioId: usuarioId,
        },
      },
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

  async redirecionarParaDashboard(req, res) {
    return res.redirect("/dashboard");
  }

  async iniciarDashboard(req, res) {
    return res.render("dashboard");
  }

  async atualizarDados(usuarioId) {
    const controller = new DashboardController();
    let values = {
      vendasMensais: await controller.buscarIndicadorVendasMensais(usuarioId),
      vendasMensaisPorValorVenda: await controller.buscarIndicadorVendasMensaisPorValorVenda(
        usuarioId
      ),
      vendasPorProdutos: await controller.buscarIndicadorVendasPorProdutos(
        usuarioId
      ),
      vendasPorFornecedores: await controller.buscarIndicadorVendasPorFornecedores(
        usuarioId
      ),
      vendasPorCategorias: await controller.buscarIndicadorVendasPorCategorias(
        usuarioId
      ),
      vendasPorSituacoes: await controller.buscarIndicadorVendasPorSituacoes(
        usuarioId
      ),
      vendasPorAprovacoes: await controller.buscarIndicadorVendasPorAprovacoes(
        usuarioId
      ),
      cards: await controller.buscarIndicadoresDosCards(usuarioId),
    };

    let userSocketEmit = `userId:${usuarioId}`;
    console.log(`Emitindo para: ${userSocketEmit}`);
    const socketIO = io.getSocket();
    socketIO.emit(userSocketEmit, values);
  }
}
export default new DashboardController();

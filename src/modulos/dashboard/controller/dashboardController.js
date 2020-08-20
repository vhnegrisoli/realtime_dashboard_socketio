import * as io from "./../../../config/socket/index";

import Categoria from "../../produto/model/Categoria";
import Fornecedor from "../../produto/model/Fornecedor";
import Produto from "../../produto/model/Produto";
import Venda from "../../venda/model/Venda";

class DashboardController {
  async inserirDadosIniciais(req, res) {
    const { vendas, produtos, categorias, fornecedores } = req.body;

    if (!vendas || !produtos || !categorias || !fornecedores) {
      return res
        .status(400)
        .json({ message: "É necessário informar todos os Models" });
    }

    await Categoria.insertMany(categorias);
    await Fornecedor.insertMany(fornecedores);
    await Produto.insertMany(produtos);
    await Venda.insertMany(vendas);

    return res
      .status(201)
      .json({ message: "Todos os dados iniciais foram inseridos!" });
  }

  iniciarDashboard(req, res) {
    return res.render("dashboard", {
      card1: 0,
      card2: 0,
      card3: 0,
      card4: 0,
    });
  }

  atualizarDados(req, res) {
    const { labels, data } = req.body;
    let values = {
      labels,
      data,
    };
    const socketIO = io.getSocket();
    socketIO.emit("dados", values);
    return res.json({ message: "Enviado!" });
  }

  novosDados(req, res) {
    console.log("Tô no servidor");
    console.log(req.body);
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

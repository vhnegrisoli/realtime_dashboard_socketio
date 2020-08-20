import * as io from "../../../config/socket/index";

import Venda from "../model/Venda";

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

  async salvarVenda(req, res) {
    const {
      produto,
      categoria,
      fornecedorRazaoSocial,
      fornecedorRazaoCnpj,
      dataVenda,
      quantidade,
      valorVenda,
    } = req.body;
    const vendaSalva = await Venda.create({
      produto,
      categoria,
      fornecedorRazaoSocial,
      fornecedorRazaoCnpj,
      dataVenda,
      quantidade,
      valorVenda,
    });
    return res.json(vendaSalva);
  }
}
export default new VendaController();

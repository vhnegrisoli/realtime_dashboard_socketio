import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const VendaSchema = new Schema({
  produto: String,
  quantidade: Number,
  categoria: String,
  fornecedorRazaoSocial: String,
  razaoSocialCnpj: String,
  valorVenda: Number,
  dataVenda: Date,
  situacao: String,
  aprovacao: String,
});

module.exports = model("Venda", VendaSchema);

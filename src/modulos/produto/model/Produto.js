import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const ProdutoSchema = new Schema({
  produto: String,
  categoria: String,
  fornecedor: String,
  valorProduto: Number,
});

module.exports = model("Produto", ProdutoSchema);

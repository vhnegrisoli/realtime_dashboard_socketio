import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const DadosMensaisSchema = new Schema({
  produto: String,
  categoria: String,
  fornecedor: String,
  valorVenda: Number,
  dataVenda: Date,
  mesVenda: String,
  mesVendaValor: Number,
  anoVenda: Number,
});

module.exports = model("DadosMensais", DadosMensaisSchema);
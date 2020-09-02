import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const FornecedorSchema = new Schema({
  razaoSocial: String,
  cnpj: String,
  usuarioId: mongoose.ObjectId,
});

module.exports = model('Fornecedor', FornecedorSchema);

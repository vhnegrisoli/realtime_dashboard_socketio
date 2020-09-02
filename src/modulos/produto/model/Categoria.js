import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const CategoriaSchema = new Schema({
  descricao: String,
  usuarioId: mongoose.ObjectId,
});

module.exports = model('Categoria', CategoriaSchema);

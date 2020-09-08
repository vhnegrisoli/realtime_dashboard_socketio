import Produto from '../model/Produto';
import Fornecedor from '../model/Fornecedor';
import Categoria from '../model/Categoria';

class ProdutoController {
  async iniciarFormularioProduto(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const categorias = await Categoria.find({ usuarioId });
    const fornecedores = await Fornecedor.find({ usuarioId });
    const categoriasResponse = [];
    const fornecedoresResponse = [];

    categorias.forEach((categoria) => {
      categoriasResponse.push(categoria.descricao);
    });

    fornecedores.forEach((fornecedor) => {
      fornecedoresResponse.push(`${fornecedor.razaoSocial} - ${fornecedor.cnpj}`);
    });

    res.render('produtos/cadastrar', {
      categorias: categoriasResponse,
      fornecedores: fornecedoresResponse,
    });
  }

  async buscarProduto(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    const produto = await Produto.findOne({ _id: id, usuarioId });
    if (!produto) {
      return res.status(400).json({ message: 'O produto não foi encontrado.' });
    }
    return res.json(produto);
  }

  async listarTodos(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const produtos = await Produto.find({ usuarioId });
    const produtosResponse = [];
    produtos.map((produto) => {
      produtosResponse.push({
        id: produto._id,
        produto: produto.produto,
        preco: produto.valorVenda.toFixed(2),
        categoria: produto.categoria,
        razaoSocialCnpj: `${produto.fornecedorRazaoSocial} | ${produto.fornecedorCnpj}`,
      });
    });
    res.render('produtos/listar', {
      produtos: produtosResponse,
    });
  }

  async buscarTodos(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const produtos = await Produto.find({ usuarioId });
    return res.json(produtos);
  }

  async salvarProduto(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { produto, valorVenda, categoria, fornecedor } = req.body;
    console.log(req.body);
    if (!produto || !valorVenda || !categoria || !fornecedor) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    if (valorVenda <= 0.0) {
      return res.status(400).json({
        message: 'O preço do produto não pode ser menor ou igual a 0.',
      });
    }
    try {
      const produtoExistente = await Produto.findOne({ produto, usuarioId });
      if (produtoExistente) {
        return res.status(400).json({ message: 'O produto já existe.' });
      }
      const cnpj = fornecedor.split(' - ')[1];
      if (!cnpj) {
        return res.status(400).json({ message: 'O CNPJ não foi informado.' });
      }
      const fornecedorExistente = await Fornecedor.findOne({ cnpj, usuarioId });
      if (!fornecedorExistente) {
        return res.status(400).json({ message: 'O fornecedor não existe.' });
      }
      const categoriaExistente = await Categoria.findOne({
        descricao: categoria,
        usuarioId,
      });
      if (!categoriaExistente) {
        return res.status(400).json({ message: 'A categoria não existe.' });
      }
      await Produto.create({
        produto: produto,
        categoria: categoriaExistente.descricao,
        fornecedorRazaoSocial: fornecedorExistente.razaoSocial,
        fornecedorCnpj: fornecedorExistente.cnpj,
        valorVenda,
        usuarioId,
      });
      return res.json({ message: 'O produto foi inserido com sucesso!' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao salvar o produto.' });
    }
  }
  async editarProduto(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    const produtoExistente = await Produto.findOne({ _id: id, usuarioId });
    if (!produtoExistente) {
      return res.status(400).json({ message: 'O produto não foi encontrado.' });
    }
    const { produto, valorVenda, categoria, fornecedor } = req.body;
    if (!produto || !valorVenda || !categoria || !fornecedor) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    if (valorVenda <= 0.0) {
      return res.status(400).json({
        message: 'O preço do produto não pode ser menor ou igual a 0.',
      });
    }
    if (produto === produto.produto && String(produto._id) !== String(id)) {
      return res.status(400).json({ message: 'Este produto já está cadastrado.' });
    }
    try {
      const cnpj = fornecedor.split(' - ');
      if (!cnpj) {
        return res.status(400).json({ message: 'O CNPJ não foi informado.' });
      }
      const fornecedorExistente = await Fornecedor.findOne({ cnpj, usuarioId });
      if (!fornecedorExistente) {
        return res.status(400).json({ message: 'O fornecedor não existe.' });
      }
      const categoriaExistente = await Categoria.findOne({
        descricao: categoria,
        usuarioId,
      });
      if (!categoriaExistente) {
        return res.status(400).json({ message: 'A categoria não existe.' });
      }
      produtoExistente.produto = produto;
      produtoExistente.valorVenda = valorVenda;
      produtoExistente.categoria = categoriaExistente.descricao;
      produtoExistente.fornecedorCnpj = fornecedorExistente.cnpj;
      produtoExistente.fornecedorRazaoSocial = fornecedorExistente.razaoSocial;
      await produtoExistente.save();
      return res.json({ message: 'O produto foi atualizado com sucesso!' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao atualizar o produto.' });
    }
  }

  async removerProduto(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    try {
      await Produto.findByIdAndRemove(id);
      return res.json('O produto foi removido com sucesso!');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao remover o produto.' });
    }
  }
}
export default new ProdutoController();

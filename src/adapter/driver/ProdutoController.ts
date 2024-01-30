import { Produto } from '../../core/domain/models/Produto';
import { ProdutoUseCase } from '../../core/domain/useCases/Produto/ProdutoUseCase';

export class ProdutoController {
  constructor(private produtoUseCase: ProdutoUseCase) {}

  async cadastrarProduto(
    nome: string,
    categoria: string,
    preco: number,
    descricao: string,
    imagem: string,
    res: any
  ) {
    try {
      const produto = new Produto(nome, categoria, preco, descricao, imagem);
      const produtoCriado = await this.produtoUseCase.cadastrarProduto(
        produto,
        res
      );
      res.status(201).send(produtoCriado);
    } catch (error) {
      throw new Error('Erro ao cadastrar produto');
    }
  }

  async exibirProdutos(res: any) {
    try {
      const produtos = await this.produtoUseCase.listarProdutos(res);
      res.status(200).send(produtos);
    } catch (error) {
      throw new Error('Erro ao buscar produtos');
    }
  }

  async exibirProdutoPorId(id: number, res: any) {
    try {
      const produto = await this.produtoUseCase.listarProdutoPorId(id, res);
      if (!produto) {
        return res.status(404).send('Produto não encontrado');
      }
      res.status(200).send(produto);
    } catch (error) {
      throw new Error('Erro ao buscar produto');
    }
  }

  async exibirProdutoPorCategoria(categoria: string, res: any) {
    try {
      const produtos = await this.produtoUseCase.listarProdutoPorCategoria(
        categoria,
        res
      );
      if (produtos.length === 0) {
        return res.status(404).send('Categoria não encontrada ou sem produtos');
      }
      res.status(200).send(produtos);
    } catch (error) {
      throw new Error('Erro ao buscar produtos por categoria');
    }
  }

  async alterarProduto(
    id: number,
    nome: string,
    categoria: string,
    preco: number,
    descricao: string,
    imagem: string,
    res: any
  ) {
    try {
      const produto = new Produto(
        nome,
        categoria,
        preco,
        descricao,
        imagem,
        id
      );
      const produtoAlterado = await this.produtoUseCase.alterarProduto(
        produto,
        res
      );

      if (!produtoAlterado) {
        throw new Error('Produto não encontrado ou não alterado');
      }

      res.status(200).send(produtoAlterado);
    } catch (error) {
      throw error;
    }
  }

  async apagarProduto(id: number, res: any) {
    try {
      const resultado = await this.produtoUseCase.apagarProduto(id, res);

      if (!resultado) {
        throw new Error('Produto não encontrado ou não excluído');
      }

      res.status(200).send('Produto excluído com sucesso');
    } catch (error) {
      throw error;
    }
  }
}

// export class ProdutoController {
//   async cadastrarProduto(
//     nome: string,
//     categoria: string,
//     preco: number,
//     descricao: string,
//     imagem: string,
//     res: any
//   ) {
//     let produto = new Produto(nome, categoria, preco, descricao, imagem);
//     let produtoUseCase = new ProdutoUseCase();
//     await produtoUseCase.cadastrarProduto(produto, res);
//   }
//   async exibirProdutos(res: any) {
//     let produtoUseCase = new ProdutoUseCase();
//     await produtoUseCase.listarProdutos(res);
//   }
//   async exibirProdutoPorId(id: number, res: any) {
//     let produtoUseCase = new ProdutoUseCase();
//     await produtoUseCase.listarProdutoPorId(id, res);
//   }
//   async exibirProdutoPorCategoria(categoria: string, res: any) {
//     let produtoUseCase = new ProdutoUseCase();
//     await produtoUseCase.listarProdutoPorCategoria(categoria, res);
//   }
//   async alterarProduto(
//     id: number,
//     nome: string,
//     categoria: string,
//     preco: number,
//     descricao: string,
//     imagem: string,
//     res: any
//   ) {
//     let produto = new Produto(nome, categoria, preco, descricao, imagem, id);
//     let produtoUseCase = new ProdutoUseCase();
//     await produtoUseCase.alterarProduto(produto, res);
//   }
//   async apagarProduto(id: number, res: any) {
//     let produtoUseCase = new ProdutoUseCase();
//     await produtoUseCase.apagarProduto(id, res);
//   }
// }

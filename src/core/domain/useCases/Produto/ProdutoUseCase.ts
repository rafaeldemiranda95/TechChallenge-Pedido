import { ProdutoRepository } from '../../../../adapter/driven/infra/ProdutoRepository';
export class ProdutoUseCase {
  constructor(private produtoRepository: ProdutoRepository) {}
  async cadastrarProduto(produto: any, res: any) {
    try {
      const produtoCriado = await this.produtoRepository.salvar(produto);
      res.status(201).send(produtoCriado);
    } catch (error: any) {
      const errorType = JSON.parse(error.message);
      if (errorType.code == 'P2002') {
        throw new Error(errorType.field);
      }
    }
  }

  async listarProdutos(res: any) {
    try {
      const produtos = await this.produtoRepository.exibirLista();
      if (produtos.length == 0 || produtos == undefined) {
        res.status(404).send('Não foram encontrados produtos');
      } else {
        res.status(200).send(produtos);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async listarProdutoPorId(id: number, res: any) {
    try {
      const produto = await this.produtoRepository.exibirPorId(id);
      if (produto == null || produto == undefined) {
        res.status(404).send('Produto não encontrado');
      } else {
        res.status(200).send(produto);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async listarProdutoPorCategoria(categoria: string, res: any) {
    try {
      const produtos = await this.produtoRepository.exibirPorCategoria(
        categoria
      );
      if (produtos.length == 0 || produtos == undefined) {
        throw new Error('Categoria não encontrada');
      } else {
        res.status(200).send(produtos);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async alterarProduto(produto: any, res: any) {
    try {
      const produtoAlterado = await this.produtoRepository.alterar(produto);
      res.status(200).send(produtoAlterado);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async apagarProduto(id: number, res: any) {
    try {
      await this.produtoRepository.apagar(id);
      res.status(200).send('Produto excluído');
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

import { ProdutoRepository } from '../../../../adapter/driven/infra/ProdutoRepository';
import { Produto } from '../../models/Produto';
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

  async listarProdutoPorId(id: number, res: any): Promise<Produto | null> {
    try {
      const produto = await this.produtoRepository.exibirPorId(id);
      if (produto == null || produto == undefined) {
        return null;
      } else {
        return produto;
      }
    } catch (error) {
      throw new Error('Erro ao buscar produto no repositório');
    }
  }

  async listarProdutoPorCategoria(categoria: string, res: any) {
    try {
      const produtos = await this.produtoRepository.exibirPorCategoria(
        categoria
      );
      if (produtos.length == 0 || produtos == undefined) {
        return [];
      } else {
        return produtos;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async alterarProduto(produto: any, res: any) {
    try {
      const produtoAlterado = await this.produtoRepository.alterar(produto);
      if (produtoAlterado == null || produtoAlterado == undefined) {
        return null;
      } else {
        return produtoAlterado;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async apagarProduto(id: number, res: any): Promise<string | null> {
    try {
      await this.produtoRepository.apagar(id);
      return 'Produto excluído';
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

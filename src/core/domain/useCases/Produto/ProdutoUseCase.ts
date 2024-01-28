import { ProdutoRepository } from '../../../../adapter/driven/infra/ProdutoRepository';
export class ProdutoUseCase {
  async cadastrarProduto(produto: any, res: any) {
    try {
      let produtoCriado = await new ProdutoRepository().salvar(produto);
      res.status(201).send(produtoCriado);
    } catch (error: any) {
      let errorType = JSON.parse(error.message);
      if (errorType.code == 'P2002') {
        throw new Error(errorType.field);
        // res.status(400).send(`${errorType.field} já cadastrado`);
      }
    }
  }

  async listarProdutos(res: any) {
    try {
      let produtos = await new ProdutoRepository().exibirLista();
      if (produtos.length == 0 || produtos == undefined) {
        res.status(404).send('Não foram encontrados produtos');
      } else {
        res.status(200).send(produtos);
      }
    } catch (error: any) {
      throw new Error(error);
      // res.status(204).send('Não foram encontrados produtos');
    }
  }

  async listarProdutoPorId(id: number, res: any) {
    try {
      let produto = await new ProdutoRepository().exibirPorId(id);
      if (produto == null || produto == undefined) {
        res.status(404).send('Produto não encontrado');
      } else {
        res.status(200).send(produto);
      }
    } catch (error: any) {
      throw new Error(error);
      // console.log(error);
      // res.status(204).send('Produto não encontrado');
    }
  }

  async listarProdutoPorCategoria(categoria: string, res: any) {
    try {
      let produtos = await new ProdutoRepository().exibirPorCategoria(
        categoria
      );
      if (produtos.length == 0 || produtos == undefined) {
        throw new Error('Categoria não encontrada');
      } else {
        res.status(200).send(produtos);
      }
    } catch (error: any) {
      throw new Error(error);
      // console.log(error);
      // res.status(204).send('Não foram encontrados produtos');
    }
  }

  async alterarProduto(produto: any, res: any) {
    try {
      let produtoAlterado = await new ProdutoRepository().alterar(produto);
      res.status(200).send(produtoAlterado);
    } catch (error: any) {
      console.log(error);
    }
  }

  async apagarProduto(id: number, res: any) {
    try {
      await new ProdutoRepository().apagar(id);
      res.status(200).send('Produto excluído');
    } catch (error: any) {
      console.log(error);
    }
  }
}

import { runQuery } from '../../../config/database';
import { Produto } from '../../../core/domain/models/Produto';
import { IProdutoUseCase } from '../../../core/domain/useCases/Produto/IProdutoUseCase';

export class ProdutoRepository implements IProdutoUseCase {
  async exibirLista(): Promise<Produto[]> {
    let query = 'SELECT * FROM produto';
    const produtos = await runQuery(query);
    console.log(produtos);
    return produtos;
  }

  async exibirPorCategoria(categoria: string): Promise<Produto[]> {
    const query = `SELECT * FROM produto WHERE categoria = '${categoria}'`;
    const _produtos = await runQuery(query);
    let produtos: Produto[] = _produtos;

    return produtos;
  }

  async exibirPorId(id: number): Promise<Produto | undefined> {
    const query = `SELECT * FROM public.produto WHERE id = ${id}`;
    const _produto = await runQuery(query);

    if (_produto.length === 0) {
      return undefined;
    }

    let produto: Produto = _produto[0];

    return produto;
  }

  async salvar(produto: Produto): Promise<Produto | undefined> {
    try {
      const query = `INSERT INTO public.produto(
        nome, categoria, preco, descricao, imagem)
        VALUES ('${produto.nome}', '${produto.categoria}', ${produto.preco}, '${produto.descricao}', '${produto.imagem} RETURNING *');`;
      let _returnProduto = await runQuery(query);

      if (_returnProduto.length > 0) {
        let returnProduto: Produto = _returnProduto[0];
        return returnProduto;
      } else {
        return undefined;
      }
    } catch (error: any) {
      console.log('error  ==>>  ', error);
      throw new Error(error.message);
    }
  }

  async alterar(produto: Produto): Promise<Produto> {
    const query = `UPDATE public.produto
    SET nome='${produto.nome}', categoria='${produto.categoria}', preco=${produto.preco}, descricao='${produto.descricao}', imagem='${produto.imagem}'
    WHERE id = ${produto.id}  RETURNING *`;
    let _pagamentoreturnProduto = await runQuery(query);
    let returnProduto: Produto = _pagamentoreturnProduto[0];

    return returnProduto;
  }

  async apagar(id: number): Promise<Produto | undefined> {
    const query = `DELETE FROM public.produto
    WHEREid = ${id} RETURNING *`;
    const _produto = await runQuery(query);
    if (_produto.length === 0) {
      return undefined;
    }
    let produto: Produto = _produto[0];
    return produto;
  }
}

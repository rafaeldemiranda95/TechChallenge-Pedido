import { Produto } from '../../core/domain/models/Produto';
import { ProdutoUseCase } from '../../core/domain/useCases/Produto/ProdutoUseCase';
export class ProdutoController {
  async cadastrarProduto(
    nome: string,
    categoria: string,
    preco: number,
    descricao: string,
    imagem: string,
    res: any
  ) {
    let produto = new Produto(nome, categoria, preco, descricao, imagem);
    let produtoUseCase = new ProdutoUseCase();
    await produtoUseCase.cadastrarProduto(produto, res);
  }
  async exibirProdutos(res: any) {
    let produtoUseCase = new ProdutoUseCase();
    await produtoUseCase.listarProdutos(res);
  }
  async exibirProdutoPorId(id: number, res: any) {
    let produtoUseCase = new ProdutoUseCase();
    await produtoUseCase.listarProdutoPorId(id, res);
  }
  async exibirProdutoPorCategoria(categoria: string, res: any) {
    let produtoUseCase = new ProdutoUseCase();
    await produtoUseCase.listarProdutoPorCategoria(categoria, res);
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
    let produto = new Produto(nome, categoria, preco, descricao, imagem, id);
    let produtoUseCase = new ProdutoUseCase();
    await produtoUseCase.alterarProduto(produto, res);
  }
  async apagarProduto(id: number, res: any) {
    let produtoUseCase = new ProdutoUseCase();
    await produtoUseCase.apagarProduto(id, res);
  }
}

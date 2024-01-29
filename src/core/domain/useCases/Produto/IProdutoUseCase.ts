import { Produto } from '../../models/Produto';
export interface IProdutoUseCase {
  salvar(produto: Produto): Promise<Produto | undefined>;
  exibirLista(): Promise<Produto[]>;
  exibirPorCategoria(categoria: string): Promise<Produto[]>;
  exibirPorId(id: number): Promise<Produto | undefined>;
  alterar(produto: Produto): Promise<Produto>;
  apagar(id: number): Promise<Produto | undefined>;
}

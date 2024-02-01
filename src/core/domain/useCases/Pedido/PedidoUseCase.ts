import { PedidoRepository } from '../../../../adapter/driven/infra/PedidoRepository';
import { ProdutoRepository } from '../../../../adapter/driven/infra/ProdutoRepository';
import { Pedido } from '../../../domain/models/Pedido';

export class PedidoUseCase {
  constructor(
    private pedidoRepository: PedidoRepository,
    private produtoRepository: ProdutoRepository
  ) {}

  async enviarPedido(pedido: Pedido) {
    const total = await this.calcularTotalPedido(pedido);
    const tempoPreparo = await this.calcularTempoPreparo(pedido);
    pedido.total = total;
    pedido.tempoEspera = tempoPreparo;

    return this.pedidoRepository.salvar(pedido);
  }

  private async calcularTotalPedido(pedido: Pedido): Promise<number> {
    let total = 0;
    for (const item of pedido.produto) {
      if (typeof item.id === 'number') {
        const produto = await this.produtoRepository.exibirPorId(item.id);
        total += (produto?.preco ?? 0) * item.quantidade;
      }
    }
    return total;
  }

  private async calcularTempoPreparo(pedido: Pedido): Promise<number> {
    let tempoPreparo = 0;
    for (const item of pedido.produto) {
      if (typeof item.id === 'number') {
        const produto = await this.produtoRepository.exibirPorId(item.id);
        tempoPreparo += (produto?.tempoPreparo ?? 0) * item.quantidade;
      }
    }
    return tempoPreparo;
  }
}

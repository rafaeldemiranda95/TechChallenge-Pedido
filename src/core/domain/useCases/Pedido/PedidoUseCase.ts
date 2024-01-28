import { PedidoRepository } from '../../../../adapter/driven/infra/PedidoRepository';
import { ProdutoRepository } from '../../../../adapter/driven/infra/ProdutoRepository';
import { Pedido } from '../../../domain/models/Pedido';
export class PedidoUseCase {
  async enviarPedido(pedido: Pedido) {
    await this.calcularTotalPedido(pedido);
    await this.calcularTempoPreparo(pedido);
    let response = await new PedidoRepository().salvar(pedido);
    return response;
  }

  async calcularTotalPedido(pedido: Pedido): Promise<number | undefined> {
    try {
      let total = 0;
      for (let item of pedido.produto) {
        if (item.id != undefined) {
          let produto = await new ProdutoRepository().exibirPorId(item.id);
          if (produto.preco)
            total += produto.preco
              ? produto.preco * item.quantidade
              : 0 * item.quantidade;
        }
      }
      pedido.total = total;
      return total;
    } catch (error: any) {
      console.log('error', error);
    }
  }

  async calcularTempoPreparo(pedido: Pedido): Promise<number | undefined> {
    try {
      let tempoPreparo = 0;

      for (let item of pedido.produto) {
        if (item.id != undefined) {
          let produto = await new ProdutoRepository().exibirPorId(item.id);
          if (produto.tempoPreparo) {
            tempoPreparo += produto.tempoPreparo * item.quantidade;
          }
        }
      }

      pedido.tempoEspera = tempoPreparo;
      return tempoPreparo;
    } catch (error: any) {
      console.log('error', error);
    }
  }
}

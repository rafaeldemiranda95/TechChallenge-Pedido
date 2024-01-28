export class PedidoProduto {
  pedidoId: number;
  produtoId: number;
  quantidade: number;

  constructor(pedidoId: number, produtoId: number, quantidade: number) {
    this.pedidoId = pedidoId;
    this.produtoId = produtoId;
    this.quantidade = quantidade;
  }
}

export class ItensPedido {
  id?: number;
  quantidade: number;
  produtoId: number;

  constructor(quantidade: number, produtoId: number, id?: number) {
    this.quantidade = quantidade;
    this.produtoId = produtoId;
    this.id = id;
  }
}

export class Fila {
  status: string;
  usuarioId: number;
  pedidoId: number;
  id?: number;

  constructor(
    status: string,
    usuarioId: number,
    pedidoId: number,
    id?: number
  ) {
    this.status = status;
    this.usuarioId = usuarioId;
    this.pedidoId = pedidoId;
    this.id = id;
  }
}

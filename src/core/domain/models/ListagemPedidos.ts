import { Produto } from './Produto';

export class ListagemPedidos {
  id: number;
  usuarioId: number;
  produtos: any;
  status: string;
  tempoEspera: number;
  total: number;

  constructor(
    id: number,
    usuarioId: number,
    produtos: any,
    status: string,
    tempoEspera: number,
    total: number
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.produtos = produtos;
    this.status = status;
    this.tempoEspera = tempoEspera;
    this.total = total;
  }
}

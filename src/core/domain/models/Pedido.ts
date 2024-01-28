import { Usuario } from '../../../core/domain/models/Usuario';
import { ItensPedido } from './ItensPedido';
export class Pedido {
  id?: number;
  usuario: Usuario;
  produto: Array<ItensPedido>;
  status: string;
  tempoEspera?: number;
  total?: number;

  constructor(
    usuario: Usuario,
    produto: Array<ItensPedido>,
    tempoEspera?: number,
    total?: number,
    id?: number
  ) {
    this.produto = produto;
    this.usuario = usuario;
    this.status = 'Recebido';
    this.tempoEspera = tempoEspera;
    this.total = total;
    this.id = id;
  }
}

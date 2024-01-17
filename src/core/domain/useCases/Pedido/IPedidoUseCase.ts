import { Fila } from '../../models/Fila';
import { Pedido } from '../../models/Pedido';
export interface IPedidoUseCase {
  salvar(pedido: Pedido): Promise<any>;
  listar(): any;
  enviarParaFila(pedido: Pedido): Promise<void>;
  trocarStatusFila(id: number, status: string): Promise<void>;
  listagemFilas(): Promise<any>;
}

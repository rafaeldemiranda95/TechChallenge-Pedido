import { Pedido } from '../../models/Pedido';
export interface IPedidoUseCase {
  salvar(pedido: Pedido): Promise<any>;
  enviarParaFila(pedido: Pedido): Promise<void>;
}

import { Pedido } from '../../../core/domain/models/Pedido';
import { IPedidoUseCase } from '../../../core/domain/useCases/Pedido/IPedidoUseCase';
import { runQuery } from './../../../config/database';
export class PedidoRepository implements IPedidoUseCase {
  async enviarParaFila(pedido: Pedido): Promise<void> {
    try {
      let query = `INSERT INTO public.fila(pedidoId, status, usuarioId) VALUES (${pedido.id ? pedido.id : 0
        }, ${pedido.status}, ${pedido.usuario.id})`;
      await runQuery(query);
    } catch (error: any) {
      console.log('error', error);
    }
  }
  async salvar(pedido: Pedido): Promise<any> {
    try {
      let query = `INSERT INTO public.pedido(status, usuarioId, total, tempoEspera) 
      VALUES ('${pedido.status}', ${pedido.usuario.id}, ${pedido.total}, ${pedido.tempoEspera}) RETURNING *`;
      let _pedidoInsert = await runQuery(query);

      // console.log('_pedidoInsert  ==>>  ', _pedidoInsert);
      // console.log('_pedidoInsert  ==>>  ', _pedidoInsert);
      // console.log('_pedidoInsert  ==>>  ', _pedidoInsert);
      // console.log('_pedidoInsert  ==>>  ', _pedidoInsert);

      if (_pedidoInsert.length > 0) {
        let pedidoInsert = _pedidoInsert[0];
        for (let pedidoProduto of pedido.produto) {
          if (pedidoProduto.id != undefined) {
            let query02 = `INSERT INTO public.pedidoproduto(pedidoId, produtoId, quantidade) 
            VALUES (${pedidoInsert.id}, ${pedidoProduto.id}, ${pedidoProduto.quantidade}) RETURNING *`;
            await runQuery(query02);
          }
        }

        pedido.id = pedidoInsert.id;
        await this.enviarParaFila(pedido);
        // await this.criarPagamento(pedido);
        let retorno = {
          tempoEspera: pedido.tempoEspera,
          status: pedido.status,
          codigo: pedido.id,
        };
        return retorno;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  // async criarPagamento(pedido: Pedido): Promise<void> {
  //   try {
  //     await prisma.pagamento.create({
  //       data: {
  //         pedidoId: pedido.id ? pedido.id : 0,
  //         valor: pedido.total ? pedido.total : 0,
  //         status: 'Pendente',
  //         usuarioId: pedido.usuario.id,
  //       },
  //     });
  //   } catch (error: any) {
  //     console.log('error', error);
  //   }
  // }
}

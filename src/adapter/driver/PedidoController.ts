import { Response } from 'express';
import { ItensPedido } from '../../core/domain/models/ItensPedido';
import { Pedido } from '../../core/domain/models/Pedido';
import { PedidoUseCase } from '../../core/domain/useCases/Pedido/PedidoUseCase';
import { ObterValoresToken } from '../../core/domain/valueObjects/obterValoresToken';
export class PedidoController {
  async enviarPedido(token: any, produto: Array<ItensPedido>, res: Response) {
    try {
      let valores = new ObterValoresToken();
      let usuario: any = await valores.obterInformacoesToken(token);
      if (usuario == undefined) {
        res.status(401).send('Token inválido!');
        return;
      }
      let pedido: Pedido = new Pedido(usuario, produto);
      let response = await new PedidoUseCase().enviarPedido(pedido);
      return response;
    } catch (error) {
      res.status(400).send('Erro ao enviar pedido');
    }
  }
}

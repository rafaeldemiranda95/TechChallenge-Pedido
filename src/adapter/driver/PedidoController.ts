import { Response } from 'express';
import { ItensPedido } from '../../core/domain/models/ItensPedido';
import { Pedido } from '../../core/domain/models/Pedido';
import { PedidoUseCase } from '../../core/domain/useCases/Pedido/PedidoUseCase';
import { ObterValoresToken } from '../../core/domain/valueObjects/obterValoresToken';

export class PedidoController {
  constructor(
    private obterValoresToken: ObterValoresToken,
    private pedidoUseCase: PedidoUseCase
  ) {}

  async enviarPedido(
    token: string,
    produtos: Array<ItensPedido>,
    res: Response
  ) {
    try {
      const usuario = await this.obterValoresToken.obterInformacoesToken(token);
      if (!usuario) {
        return res.status(401).send('Token inválido!');
      }

      const pedido = new Pedido(usuario, produtos);
      const response = await this.pedidoUseCase.enviarPedido(pedido);
      res.status(200).send(response);
    } catch (error) {
      throw new Error('Erro ao enviar pedido');
    }
  }
}

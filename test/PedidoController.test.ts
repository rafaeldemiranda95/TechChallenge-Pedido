import { Response } from 'express';
import { PedidoRepository } from '../src/adapter/driven/infra/PedidoRepository';
import { ProdutoRepository } from '../src/adapter/driven/infra/ProdutoRepository';
import { PedidoController } from '../src/adapter/driver/PedidoController';
import { Pedido } from '../src/core/domain/models/Pedido';
import { Usuario } from '../src/core/domain/models/Usuario';
import { PedidoUseCase } from '../src/core/domain/useCases/Pedido/PedidoUseCase';
import { ObterValoresToken } from '../src/core/domain/valueObjects/obterValoresToken';

jest.mock('../src/core/domain/valueObjects/obterValoresToken');
jest.mock('../src/core/domain/useCases/Pedido/PedidoUseCase');
jest.mock('../src/adapter/driven/infra/PedidoRepository');
jest.mock('../src/adapter/driven/infra/ProdutoRepository');

describe('PedidoController - enviarPedido', () => {
  let pedidoController: PedidoController;
  let mockObterValoresToken: jest.Mocked<ObterValoresToken>;
  let mockPedidoUseCase: jest.Mocked<PedidoUseCase>;
  let mockPedidoRepository: jest.Mocked<PedidoRepository>;
  let mockProdutoRepository: jest.Mocked<ProdutoRepository>;
  let mockRes: jest.Mocked<Response>;

  beforeEach(() => {
    mockPedidoRepository = new PedidoRepository() as any;
    mockProdutoRepository = new ProdutoRepository() as any;
    mockObterValoresToken = new ObterValoresToken() as any;
    mockPedidoUseCase = new PedidoUseCase(
      mockPedidoRepository,
      mockProdutoRepository
    ) as any;
    mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
    pedidoController = new PedidoController(
      mockObterValoresToken,
      mockPedidoUseCase
    );
  });

  it('deve enviar pedido com sucesso para token válido', async () => {
    const mockToken = 'token-valido';
    const mockItensPedido = [
      { produtoId: 1, quantidade: 5 },
      { produtoId: 2, quantidade: 10 },
    ];
    const mockUsuario = new Usuario(
      'Usuário mock',
      'mock@email.com',
      '141.276.560-93',
      'cliente',
      'mock-senha',
      mockToken,
      15
    );

    mockObterValoresToken.obterInformacoesToken.mockResolvedValue(mockUsuario);
    mockPedidoUseCase.enviarPedido.mockResolvedValue(
      'Pedido enviado com sucesso'
    );

    await pedidoController.enviarPedido(mockToken, mockItensPedido, mockRes);

    expect(mockObterValoresToken.obterInformacoesToken).toHaveBeenCalledWith(
      mockToken
    );
    expect(mockPedidoUseCase.enviarPedido).toHaveBeenCalledWith(
      new Pedido(mockUsuario, mockItensPedido)
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith('Pedido enviado com sucesso');
  });

  it('deve retornar erro 401 para token inválido', async () => {
    const mockToken = 'token-invalido';
    const mockItensPedido = [
      { produtoId: 1, quantidade: 5 },
      { produtoId: 2, quantidade: 10 },
    ];

    mockObterValoresToken.obterInformacoesToken.mockResolvedValue(undefined);

    await pedidoController.enviarPedido(mockToken, mockItensPedido, mockRes);

    expect(mockObterValoresToken.obterInformacoesToken).toHaveBeenCalledWith(
      mockToken
    );
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith('Token inválido!');
  });

  it('deve tratar erros inesperados', async () => {
    const mockToken = 'token-valido';
    const mockItensPedido = [
      { produtoId: 1, quantidade: 5 },
      { produtoId: 2, quantidade: 10 },
    ];

    mockObterValoresToken.obterInformacoesToken.mockRejectedValue(
      new Error('Erro inesperado')
    );

    await expect(
      pedidoController.enviarPedido(mockToken, mockItensPedido, mockRes)
    ).rejects.toThrow('Erro ao enviar pedido');

    expect(mockObterValoresToken.obterInformacoesToken).toHaveBeenCalledWith(
      mockToken
    );
  });
});

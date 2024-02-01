import { PedidoRepository } from '../src/adapter/driven/infra/PedidoRepository';
import { Pedido } from '../src/core/domain/models/Pedido';
import { Usuario } from '../src/core/domain/models/Usuario';

jest.mock('../src/config/database', () => ({
  runQuery: jest.fn(),
}));
describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;

  beforeEach(() => {
    pedidoRepository = new PedidoRepository();
    jest.clearAllMocks();
  });

  describe('enviarParaFila', () => {
    it('deve inserir corretamente o pedido na fila', async () => {
      const mockPedido = new Pedido(
        new Usuario('Usuario 1', 'user1@example.com', '123456'),
        [{ id: 1, quantidade: 2, produtoId: 10 }],
        30,
        100,
        1
      );
      require('../src/config/database').runQuery.mockResolvedValueOnce([]);

      await pedidoRepository.enviarParaFila(mockPedido);

      expect(require('../src/config/database').runQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO public.fila')
      );
    });

    it('deve tratar erro na inserção do pedido na fila', async () => {
      const mockPedido = new Pedido(
        new Usuario('Usuario 1', 'user1@example.com', '123456'),
        [{ id: 1, quantidade: 2, produtoId: 10 }],
        30,
        100,
        1
      );
      const errorMessage = 'Erro ao inserir na fila';
      require('../src/config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await pedidoRepository.enviarParaFila(mockPedido);
    });
  });
  describe('salvar', () => {
    it('deve inserir e retornar um pedido e seus produtos com sucesso', async () => {
      const mockPedido = new Pedido(
        new Usuario('Usuario 1', 'user1@example.com', '123456'),
        [{ id: 1, produtoId: 10, quantidade: 2 }],
        30,
        100,
        10
      );
      const mockResponsePedido = [{ id: 10, ...mockPedido }];
      const mockResponseProduto = [
        { pedidoId: 1, produtoId: 10, quantidade: 2 },
      ];
      require('../src/config/database')
        .runQuery.mockResolvedValueOnce(mockResponsePedido)
        .mockResolvedValueOnce(mockResponseProduto);

      const resultado = await pedidoRepository.salvar(mockPedido);

      expect(require('../src/config/database').runQuery).toHaveBeenCalledTimes(
        3
      );
      expect(resultado).toEqual({
        tempoEspera: mockPedido.tempoEspera,
        status: mockPedido.status,
        codigo: 10,
      });
    });

    it('deve tratar erro na inserção do pedido', async () => {
      const mockPedido = new Pedido(
        new Usuario('Usuario 1', 'user1@example.com', '123456'),
        [{ id: 1, produtoId: 10, quantidade: 2 }],
        30,
        100,
        10
      );
      const errorMessage = 'Erro ao inserir pedido';
      require('../src/config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(pedidoRepository.salvar(mockPedido)).rejects.toThrow(
        errorMessage
      );
    });
  });
});

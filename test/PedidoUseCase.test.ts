import { PedidoRepository } from '../src/adapter/driven/infra/PedidoRepository';
import { ProdutoRepository } from '../src/adapter/driven/infra/ProdutoRepository';
import { Pedido } from '../src/core/domain/models/Pedido';
import { Usuario } from '../src/core/domain/models/Usuario';
import { PedidoUseCase } from '../src/core/domain/useCases/Pedido/PedidoUseCase';

jest.mock('../src/adapter/driven/infra/PedidoRepository');
jest.mock('../src/adapter/driven/infra/ProdutoRepository');

describe('PedidoUseCase', () => {
  let pedidoUseCase: PedidoUseCase;
  let mockPedidoRepository: jest.Mocked<PedidoRepository>;
  let mockProdutoRepository: jest.Mocked<ProdutoRepository>;

  beforeEach(() => {
    mockPedidoRepository =
      new PedidoRepository() as jest.Mocked<PedidoRepository>;
    mockProdutoRepository =
      new ProdutoRepository() as jest.Mocked<ProdutoRepository>;
    pedidoUseCase = new PedidoUseCase(
      mockPedidoRepository,
      mockProdutoRepository
    );
  });

  describe('enviarPedido', () => {
    it('deve enviar um pedido com sucesso', async () => {
      const pedidoMock = new Pedido(
        new Usuario('Nome', 'email@example.com', '123456', 'cliente'),
        [{ id: 1, produtoId: 10, quantidade: 2 }],
        30,
        100,
        10
      );
      mockPedidoRepository.salvar.mockResolvedValue(pedidoMock);

      const response = await pedidoUseCase.enviarPedido(pedidoMock);

      expect(mockPedidoRepository.salvar).toHaveBeenCalledWith(pedidoMock);
      expect(response).toEqual(pedidoMock);
    });
  });
  describe('calcularTotalPedido', () => {
    it('deve calcular o total do pedido corretamente', async () => {
      const pedidoMock = new Pedido(
        new Usuario('Nome', 'email@example.com', '123456', 'cliente'),
        [{ id: 1, produtoId: 10, quantidade: 2 }],
        15,
        100,
        10
      );
      mockProdutoRepository.exibirPorId.mockResolvedValueOnce({
        id: 1,
        nome: 'Produto Teste',
        categoria: 'Categoria Teste',
        preco: 10,
        descricao: 'Descrição do Produto Teste',
        imagem: 'imagem.jpg',
        tempoPreparo: 15,
      });
      mockPedidoRepository.salvar.mockResolvedValueOnce(pedidoMock);

      const response = await pedidoUseCase.enviarPedido(pedidoMock);

      expect(response).toEqual(pedidoMock);
      // Verifique se o total e o tempo de preparo foram calculados corretamente
      expect(pedidoMock.total).toBe(20);
      expect(pedidoMock.tempoEspera).toBe(0);
    });
  });
  describe('calcularTempoPreparo', () => {
    it('deve calcular o tempo de preparo do pedido corretamente', async () => {
      const pedidoMock = new Pedido(
        new Usuario('Nome', 'email@example.com', '123456', 'cliente'),
        [{ id: 1, produtoId: 1, quantidade: 2 }],
        15,
        100,
        10
      );

      // Configurar o mock de ProdutoRepository para retornar produtos com tempo de preparo
      const produtoMock = {
        id: 1,
        nome: 'Produto 1',
        categoria: 'Categoria',
        preco: 10,
        descricao: 'Descrição',
        imagem: 'imagem.jpg',
        tempoPreparo: 15,
        // outros campos se necessário
      };

      mockProdutoRepository.exibirPorId.mockResolvedValueOnce(produtoMock);

      // Adicione mais mocks se necessário para cobrir diferentes produtos no pedido

      await pedidoUseCase.enviarPedido(pedidoMock);

      // Verifique se o tempo de preparo foi calculado corretamente
      expect(pedidoMock.tempoEspera).toBe(0);
    });
  });
  // Testes a seguir...
});

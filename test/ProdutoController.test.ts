import { ProdutoRepository } from '../src/adapter/driven/infra/ProdutoRepository';
import { ProdutoController } from '../src/adapter/driver/ProdutoController';
import { Produto } from '../src/core/domain/models/Produto';
import { ProdutoUseCase } from '../src/core/domain/useCases/Produto/ProdutoUseCase';

jest.mock('../src/adapter/driven/infra/ProdutoRepository');
jest.mock('../src/core/domain/useCases/Produto/ProdutoUseCase');

describe('ProdutoController - cadastrarProduto', () => {
  let produtoController: ProdutoController;
  let mockProdutoUseCase: jest.Mocked<ProdutoUseCase>;
  let mockRes: any;
  let mockProdutoRepository: jest.Mocked<ProdutoRepository>;

  beforeEach(() => {
    mockProdutoRepository = new ProdutoRepository() as any;

    mockProdutoUseCase = new ProdutoUseCase(mockProdutoRepository) as any;

    produtoController = new ProdutoController(mockProdutoUseCase);

    mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  });

  describe('cadastrarProduto', () => {
    it('deve cadastrar um produto com sucesso', async () => {
      mockProdutoUseCase.cadastrarProduto.mockResolvedValueOnce();

      await produtoController.cadastrarProduto(
        'Nome',
        'Categoria',
        10.0,
        'Descrição',
        'Imagem',
        mockRes
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('deve lidar com erros ao cadastrar um produto', async () => {
      const erroMock = new Error('Erro ao cadastrar produto');
      mockProdutoUseCase.cadastrarProduto.mockRejectedValue(erroMock);

      await expect(
        produtoController.cadastrarProduto(
          'Teste',
          'Categoria',
          10,
          'Descrição',
          'Imagem',
          mockRes
        )
      ).rejects.toThrow('Erro ao cadastrar produto');
    });
  });
  describe('exibirProdutos', () => {
    it('deve listar todos os produtos com sucesso', async () => {
      const mockProdutos = [
        new Produto('Produto 1', 'Categoria 1', 10, 'Descrição 1', 'Imagem 1'),
        new Produto('Produto 2', 'Categoria 2', 20, 'Descrição 2', 'Imagem 2'),
      ];

      mockProdutoUseCase.listarProdutos.mockResolvedValue(
        Promise.resolve(mockProdutos)
      );

      await produtoController.exibirProdutos(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProdutos);
    });

    it('deve lidar com erros ao buscar produtos', async () => {
      const erroMock = new Error('Erro ao buscar produtos');
      mockProdutoUseCase.listarProdutos.mockRejectedValue(erroMock);

      await expect(produtoController.exibirProdutos(mockRes)).rejects.toThrow(
        'Erro ao buscar produtos'
      );
    });
  });
  describe('exibirProdutoPorId', () => {
    it('deve exibir um produto quando encontrado por ID', async () => {
      const mockProduto = new Produto(
        'Nome',
        'Categoria',
        10.0,
        'Descrição',
        'Imagem',
        1
      );

      mockProdutoUseCase.listarProdutoPorId.mockResolvedValue(mockProduto);

      const id = 1;

      await produtoController.exibirProdutoPorId(id, mockRes);

      expect(mockProdutoUseCase.listarProdutoPorId).toHaveBeenCalledWith(
        id,
        mockRes
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProduto);
    });
    it('deve enviar status 404 quando produto não é encontrado', async () => {
      const id = 1;
      mockProdutoUseCase.listarProdutoPorId.mockResolvedValue(null);

      await produtoController.exibirProdutoPorId(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith('Produto não encontrado');
    });

    it('deve lidar com erros', async () => {
      const id = 1;
      const erroMock = new Error('Erro ao buscar produto');
      mockProdutoUseCase.listarProdutoPorId.mockRejectedValue(erroMock);

      await expect(
        produtoController.exibirProdutoPorId(id, mockRes)
      ).rejects.toThrow(erroMock.message);
    });
  });
  describe('exibirProdutoPorCategoria', () => {
    it('deve enviar produtos quando encontrados em uma categoria', async () => {
      const categoria = 'Categoria Teste';
      const mockProdutos = [
        new Produto('Produto 1', 'Categoria 1', 10, 'Descrição 1', 'Imagem 1'),
        new Produto('Produto 2', 'Categoria 2', 20, 'Descrição 2', 'Imagem 2'),
      ];
      mockProdutoUseCase.listarProdutoPorCategoria.mockResolvedValue(
        mockProdutos
      );

      await produtoController.exibirProdutoPorCategoria(categoria, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProdutos);
    });

    it('deve enviar status 404 quando não há produtos na categoria', async () => {
      const categoria = 'Categoria Vazia';
      mockProdutoUseCase.listarProdutoPorCategoria.mockResolvedValue([]);

      await produtoController.exibirProdutoPorCategoria(categoria, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith(
        'Categoria não encontrada ou sem produtos'
      );
    });

    it('deve lidar com erros', async () => {
      const categoria = 'Categoria Erro';
      const erroMock = new Error('Erro ao buscar produtos por categoria');
      mockProdutoUseCase.listarProdutoPorCategoria.mockRejectedValue(erroMock);

      await expect(
        produtoController.exibirProdutoPorCategoria(categoria, mockRes)
      ).rejects.toThrow(erroMock.message);
    });
  });
  describe('alterarProduto', () => {
    it('deve alterar um produto com sucesso', async () => {
      const produtoAlterado = new Produto(
        'Produto 1',
        'Categoria 1',
        10,
        'Descrição 1',
        'Imagem 1'
      );
      mockProdutoUseCase.alterarProduto.mockResolvedValue(produtoAlterado);

      await produtoController.alterarProduto(
        1,
        'Nome',
        'Categoria',
        10.0,
        'Descrição',
        'Imagem',
        mockRes
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(produtoAlterado);
    });

    it('deve lançar um erro quando o produto não é encontrado ou não alterado', async () => {
      mockProdutoUseCase.alterarProduto.mockResolvedValue(null);

      await expect(
        produtoController.alterarProduto(
          1,
          'Nome',
          'Categoria',
          10.0,
          'Descrição',
          'Imagem',
          mockRes
        )
      ).rejects.toThrow('Produto não encontrado ou não alterado');
    });

    it('deve lidar com erros durante a alteração do produto', async () => {
      const erroMock = new Error('Erro ao alterar produto');
      mockProdutoUseCase.alterarProduto.mockRejectedValue(erroMock);

      await expect(
        produtoController.alterarProduto(
          1,
          'Nome',
          'Categoria',
          10.0,
          'Descrição',
          'Imagem',
          mockRes
        )
      ).rejects.toThrow(erroMock.message);
    });
  });
  describe('apagarProduto', () => {
    it('deve excluir um produto e enviar resposta de sucesso', async () => {
      mockProdutoUseCase.apagarProduto.mockResolvedValue(
        'Produto excluído com sucesso'
      );

      const id = 1;
      await produtoController.apagarProduto(id, mockRes);

      expect(mockProdutoUseCase.apagarProduto).toHaveBeenCalledWith(
        id,
        mockRes
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('Produto excluído com sucesso');
    });

    it('deve lançar um erro quando o produto não é encontrado ou não excluído', async () => {
      mockProdutoUseCase.apagarProduto.mockResolvedValue(null);

      const id = 1;
      await expect(
        produtoController.apagarProduto(id, mockRes)
      ).rejects.toThrow('Produto não encontrado ou não excluído');
    });

    it('deve lidar com erros inesperados', async () => {
      const erroMock = new Error('Erro inesperado');
      mockProdutoUseCase.apagarProduto.mockRejectedValue(erroMock);

      const id = 1;
      await expect(
        produtoController.apagarProduto(id, mockRes)
      ).rejects.toThrow('Erro inesperado');
    });
  });
});

import { ProdutoRepository } from '../src/adapter/driven/infra/ProdutoRepository';
import { ProdutoUseCase } from '../src/core/domain/useCases/Produto/ProdutoUseCase';

jest.mock('../src/adapter/driven/infra/ProdutoRepository');

describe('ProdutoUseCase', () => {
  let produtoUseCase: ProdutoUseCase;
  let mockProdutoRepository: jest.Mocked<ProdutoRepository>;
  let mockRes: any;

  beforeEach(() => {
    mockProdutoRepository =
      new ProdutoRepository() as jest.Mocked<ProdutoRepository>;
    produtoUseCase = new ProdutoUseCase(mockProdutoRepository);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('cadastrarProduto', () => {
    it('deve cadastrar um produto com sucesso', async () => {
      const mockProduto = {
        nome: 'Produto Teste',
        categoria: 'Categoria Teste',
        preco: 50.3,
        descricao: 'Produto muito bom',
        imagem: '',
        tempoPreparo: 25,
        id: 10,
        quantidade: 2,
      };
      mockProdutoRepository.salvar.mockResolvedValue(mockProduto);

      await produtoUseCase.cadastrarProduto(mockProduto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith(mockProduto);
    });

    it('deve lançar um erro quando o código de erro é P2002', async () => {
      const mockProduto = { nome: 'Produto Teste', preco: 100 };
      const erroP2002 = new Error(
        JSON.stringify({ code: 'P2002', field: 'Nome do Campo' })
      );
      mockProdutoRepository.salvar.mockRejectedValue(erroP2002);

      await expect(
        produtoUseCase.cadastrarProduto(mockProduto, mockRes)
      ).rejects.toThrow(new Error('Nome do Campo'));
    });
  });

  describe('listarProdutos', () => {
    it('deve retornar uma lista de produtos', async () => {
      const mockProdutos = [
        {
          nome: 'Produto Teste',
          categoria: 'Categoria Teste',
          preco: 50.3,
          descricao: 'Produto muito bom',
          imagem: '',
          tempoPreparo: 25,
          id: 10,
          quantidade: 2,
        },
        {
          nome: 'Produto Teste02',
          categoria: 'Categoria Teste02',
          preco: 25.15,
          descricao: 'Produto muito muito bom',
          imagem: '',
          tempoPreparo: 15,
          id: 11,
          quantidade: 1,
        },
      ];
      mockProdutoRepository.exibirLista.mockResolvedValue(mockProdutos);

      await produtoUseCase.listarProdutos(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProdutos);
    });

    it('deve lançar um erro quando ocorre um erro na busca de produtos', async () => {
      const errorMessage = 'Erro na busca de produtos';
      mockProdutoRepository.exibirLista.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(produtoUseCase.listarProdutos(mockRes)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe('listarProdutoPorId', () => {
    it('deve enviar um produto quando encontrado', async () => {
      const mockProduto = {
        nome: 'Produto Teste',
        categoria: 'Categoria Teste',
        preco: 50.3,
        descricao: 'Produto muito bom',
        imagem: '',
        tempoPreparo: 25,
        id: 10,
        quantidade: 2,
      };
      mockProdutoRepository.exibirPorId.mockResolvedValue(mockProduto);
      const id = 1;

      await produtoUseCase.listarProdutoPorId(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProduto);
    });

    it('deve enviar um status 404 quando o produto não é encontrado', async () => {
      mockProdutoRepository.exibirPorId.mockResolvedValue(undefined);
      const id = 1;

      await produtoUseCase.listarProdutoPorId(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith('Produto não encontrado');
    });

    it('deve lançar um erro quando ocorre um erro na busca do produto', async () => {
      const errorMessage = 'Erro na busca do produto';
      mockProdutoRepository.exibirPorId.mockRejectedValue(
        new Error(errorMessage)
      );
      const id = 1;

      await expect(
        produtoUseCase.listarProdutoPorId(id, mockRes)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('listarProdutoPorCategoria', () => {
    it('deve enviar produtos quando encontrados em uma categoria', async () => {
      const categoria = 'Categoria Teste';
      const mockProdutos = [
        {
          nome: 'Produto Teste',
          categoria: 'Categoria Teste',
          preco: 50.3,
          descricao: 'Produto muito bom',
          imagem: '',
          tempoPreparo: 25,
          id: 10,
          quantidade: 2,
        },
        {
          nome: 'Produto Teste02',
          categoria: 'Categoria Teste02',
          preco: 25.15,
          descricao: 'Produto muito muito bom',
          imagem: '',
          tempoPreparo: 15,
          id: 11,
          quantidade: 1,
        },
      ];
      mockProdutoRepository.exibirPorCategoria.mockResolvedValue(mockProdutos);

      await produtoUseCase.listarProdutoPorCategoria(categoria, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProdutos);
    });

    it('deve lançar um erro quando nenhum produto é encontrado na categoria', async () => {
      const categoria = 'Categoria Vazia';
      mockProdutoRepository.exibirPorCategoria.mockResolvedValue([]);

      await expect(
        produtoUseCase.listarProdutoPorCategoria(categoria, mockRes)
      ).rejects.toThrow('Categoria não encontrada'); // Verifique apenas a mensagem
    });

    it('deve lançar um erro quando ocorre um erro na busca de produtos por categoria', async () => {
      const categoria = 'Categoria com Erro';
      const errorMessage = 'Erro na busca de produtos';
      mockProdutoRepository.exibirPorCategoria.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        produtoUseCase.listarProdutoPorCategoria(categoria, mockRes)
      ).rejects.toThrow(errorMessage);
    });
  });
  describe('alterarProduto', () => {});
  describe('apagarProduto', () => {});

  // Testes para cada método...
});

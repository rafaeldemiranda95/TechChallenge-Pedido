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

      const resultado = await produtoUseCase.listarProdutoPorId(id, mockRes);

      expect(resultado).toEqual(mockProduto);
    });

    it('deve enviar um status 404 quando o produto não é encontrado', async () => {
      mockProdutoRepository.exibirPorId.mockResolvedValue(undefined);
      const id = 1;

      const resultado = await produtoUseCase.listarProdutoPorId(id, mockRes);

      expect(resultado).toBeNull();
    });

    it('deve lançar um erro quando ocorre um erro na busca do produto', async () => {
      const errorMessage = 'Erro ao buscar produto no repositório';
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

      const resultado = await produtoUseCase.listarProdutoPorCategoria(
        categoria,
        mockRes
      );

      expect(resultado).toEqual(mockProdutos);
    });

    it('deve lançar um erro quando nenhum produto é encontrado na categoria', async () => {
      const categoria = 'Categoria Vazia';
      mockProdutoRepository.exibirPorCategoria.mockResolvedValue([]);

      const resultado = await produtoUseCase.listarProdutoPorCategoria(
        categoria,
        mockRes
      );

      expect(resultado).toEqual([]);
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
  describe('alterarProduto', () => {
    it('deve alterar e enviar um produto com sucesso', async () => {
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
      const produtoParaAlterar = {
        nome: 'Produto Teste Alterado',
        categoria: 'Categoria Teste',
        preco: 50.3,
        descricao: 'Produto muito bom',
        imagem: '',
        tempoPreparo: 25,
        id: 10,
        quantidade: 2,
      };
      mockProdutoRepository.alterar.mockResolvedValue(mockProduto);

      const resultado = await produtoUseCase.alterarProduto(
        produtoParaAlterar,
        mockRes
      );

      expect(mockProdutoRepository.alterar).toHaveBeenCalledWith(
        produtoParaAlterar
      );
      expect(resultado).toEqual(mockProduto);
    });
    it('deve lançar um erro quando ocorre um erro na alteração do produto', async () => {
      const produtoParaAlterar = {
        nome: 'Produto Teste',
        categoria: 'Categoria Teste',
        preco: 50.3,
        descricao: 'Produto muito bom',
        imagem: '',
        tempoPreparo: 25,
        id: 10,
        quantidade: 2,
      };
      const errorMessage = 'Erro na alteração do produto';
      mockProdutoRepository.alterar.mockRejectedValue(new Error(errorMessage));

      await expect(
        produtoUseCase.alterarProduto(produtoParaAlterar, mockRes)
      ).rejects.toThrow(new Error(errorMessage));
    });
  });
  describe('apagarProduto', () => {
    it('deve excluir um produto e enviar resposta de sucesso', async () => {
      const id = 1;
      mockProdutoRepository.apagar.mockResolvedValue(undefined);

      const resultado = await produtoUseCase.apagarProduto(id, mockRes);

      expect(mockProdutoRepository.apagar).toHaveBeenCalledWith(id);
      expect(resultado).toEqual('Produto excluído');
    });
    it('deve lançar um erro quando ocorre um erro na exclusão do produto', async () => {
      const id = 1;
      const errorMessage = 'Erro na exclusão do produto';
      mockProdutoRepository.apagar.mockRejectedValue(new Error(errorMessage));

      await expect(produtoUseCase.apagarProduto(id, mockRes)).rejects.toThrow(
        new Error(errorMessage)
      );
    });
  });
});

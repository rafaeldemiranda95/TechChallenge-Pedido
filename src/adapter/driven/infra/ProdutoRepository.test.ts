import { Produto } from '../../../core/domain/models/Produto';
import { ProdutoRepository } from './ProdutoRepository';

// Mocking da função runQuery
jest.mock('../../../config/database', () => ({
  runQuery: jest.fn(),
}));

describe('ProdutoRepository - exibirLista', () => {
  let produtoRepository: ProdutoRepository;

  beforeEach(() => {
    // Reinicia o estado do repositório e limpa os mocks antes de cada teste
    produtoRepository = new ProdutoRepository();
    jest.clearAllMocks();
  });

  describe('exibirLista', () => {
    it('deve retornar uma lista de produtos', async () => {
      const mockProdutos = [
        new Produto(
          'Produto 1',
          'Categoria 1',
          10.0,
          'Descrição 1',
          'imagem1.jpg'
        ),
        new Produto(
          'Produto 2',
          'Categoria 2',
          20.0,
          'Descrição 2',
          'imagem2.jpg'
        ),
      ];
      require('../../../config/database').runQuery.mockResolvedValueOnce(
        mockProdutos
      );

      const produtos = await produtoRepository.exibirLista();

      expect(require('../../../config/database').runQuery).toHaveBeenCalledWith(
        'SELECT * FROM produto'
      );
      expect(produtos).toEqual(mockProdutos);
    });

    it('deve tratar erro na consulta ao banco de dados', async () => {
      const errorMessage = 'Erro ao buscar produtos';
      require('../../../config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(produtoRepository.exibirLista()).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe('exibirPorCategoria', () => {
    it('deve retornar produtos de uma categoria específica', async () => {
      const categoria = 'Categoria Teste';
      const mockProdutos = [
        new Produto('Produto 1', categoria, 10.0, 'Descrição 1', 'imagem1.jpg'),
        new Produto('Produto 2', categoria, 20.0, 'Descrição 2', 'imagem2.jpg'),
      ];
      require('../../../config/database').runQuery.mockResolvedValueOnce(
        mockProdutos
      );

      const produtos = await produtoRepository.exibirPorCategoria(categoria);

      expect(require('../../../config/database').runQuery).toHaveBeenCalledWith(
        `SELECT * FROM produto WHERE categoria = '${categoria}'`
      );
      expect(produtos).toEqual(mockProdutos);
    });

    it('deve tratar erro na consulta ao banco de dados por categoria', async () => {
      const categoria = 'Categoria Teste';
      const errorMessage = 'Erro ao buscar produtos';
      require('../../../config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(
        produtoRepository.exibirPorCategoria(categoria)
      ).rejects.toThrow(errorMessage);
    });
  });
  describe('exibirPorId', () => {
    it('deve retornar um produto específico pelo ID', async () => {
      const id = 1;
      const mockProduto = new Produto(
        'Produto 1',
        'Categoria 1',
        10.0,
        'Descrição 1',
        'imagem1.jpg',
        undefined,
        id
      );
      require('../../../config/database').runQuery.mockResolvedValueOnce([
        mockProduto,
      ]);

      const produto = await produtoRepository.exibirPorId(id);

      expect(require('../../../config/database').runQuery).toHaveBeenCalledWith(
        `SELECT * FROM public.produto WHERE id = ${id}`
      );
      expect(produto).toEqual(mockProduto);
    });

    it('deve tratar erro na consulta ao banco de dados por ID', async () => {
      const id = 1;
      const errorMessage = 'Erro ao buscar produto';
      require('../../../config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(produtoRepository.exibirPorId(id)).rejects.toThrow(
        errorMessage
      );
    });

    it('deve retornar undefined quando nenhum produto é encontrado', async () => {
      const id = 99;
      require('../../../config/database').runQuery.mockResolvedValueOnce([]);

      const produto = await produtoRepository.exibirPorId(id);

      expect(produto).toBeUndefined();
    });
  });

  describe('salvar', () => {
    it('deve inserir e retornar um novo produto', async () => {
      const mockProduto = new Produto(
        'Produto Teste',
        'Categoria Teste',
        10.0,
        'Descrição Teste',
        'imagemteste.jpg'
      );
      require('../../../config/database').runQuery.mockResolvedValueOnce([
        mockProduto,
      ]);

      const produtoSalvo = await produtoRepository.salvar(mockProduto);

      expect(require('../../../config/database').runQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO public.produto')
      );
      expect(produtoSalvo).toEqual(mockProduto);
    });

    it('deve tratar erro na inserção do produto', async () => {
      const mockProduto = new Produto(
        'Produto Teste',
        'Categoria Teste',
        10.0,
        'Descrição Teste',
        'imagemteste.jpg'
      );
      const errorMessage = 'Erro ao inserir produto';
      require('../../../config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(produtoRepository.salvar(mockProduto)).rejects.toThrow(
        errorMessage
      );
    });

    it('deve retornar undefined quando a inserção do produto falha', async () => {
      const mockProduto = new Produto(
        'Produto Teste',
        'Categoria Teste',
        10.0,
        'Descrição Teste',
        'imagemteste.jpg'
      );
      require('../../../config/database').runQuery.mockResolvedValueOnce([]);

      const produtoSalvo = await produtoRepository.salvar(mockProduto);

      expect(produtoSalvo).toBeUndefined();
    });
  });

  describe('alterar', () => {
    it('deve atualizar e retornar um produto existente', async () => {
      const mockProduto = new Produto(
        'Produto Alterado',
        'Categoria Alterada',
        15.0,
        'Descrição Alterada',
        'imagemalterada.jpg',
        undefined,
        1
      );
      require('../../../config/database').runQuery.mockResolvedValueOnce([
        mockProduto,
      ]);

      const produtoAlterado = await produtoRepository.alterar(mockProduto);

      const expectedQuery = expect.stringMatching(
        new RegExp(
          `UPDATE public.produto.*SET nome='${mockProduto.nome}'.*WHERE id = ${mockProduto.id}.*RETURNING \\*`,
          's'
        )
      );
      expect(require('../../../config/database').runQuery).toHaveBeenCalledWith(
        expectedQuery
      );
      expect(produtoAlterado).toEqual(mockProduto);
    });

    it('deve tratar erro na atualização do produto', async () => {
      const mockProduto = new Produto(
        'Produto Alterado',
        'Categoria Alterada',
        15.0,
        'Descrição Alterada',
        'imagemalterada.jpg',
        undefined,
        1
      );
      const errorMessage = 'Erro ao atualizar produto';
      require('../../../config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(produtoRepository.alterar(mockProduto)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe('apagar', () => {
    it('deve remover e retornar um produto pelo ID', async () => {
      const id = 1;
      const mockProduto = new Produto(
        'Produto 1',
        'Categoria 1',
        10.0,
        'Descrição 1',
        'imagem1.jpg',
        undefined,
        id
      );
      require('../../../config/database').runQuery.mockResolvedValueOnce([
        mockProduto,
      ]);

      const produtoRemovido = await produtoRepository.apagar(id);

      const expectedQuery = expect.stringMatching(
        new RegExp(
          `DELETE FROM public.produto WHEREid = ${id} RETURNING \\*`,
          's'
        )
      );
      expect(produtoRemovido).toEqual(mockProduto);
    });

    it('deve tratar erro na remoção do produto', async () => {
      const id = 1;
      const errorMessage = 'Erro ao remover produto';
      require('../../../config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(produtoRepository.apagar(id)).rejects.toThrow(errorMessage);
    });

    it('deve retornar undefined quando nenhum produto é removido', async () => {
      const id = 99;
      require('../../../config/database').runQuery.mockResolvedValueOnce([]);

      const produtoRemovido = await produtoRepository.apagar(id);

      expect(produtoRemovido).toBeUndefined();
    });
  });
});

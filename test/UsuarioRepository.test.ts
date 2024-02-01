import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../src/adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../src/core/domain/models/Usuario';

jest.mock('./../src/config/database', () => ({
  runQuery: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const { runQuery } = require('./../src/config/database');
describe('UsuarioRepository', () => {
  let usuarioRepository: UsuarioRepository;
  const mockJwtSign = jest.spyOn(jwt, 'sign');
  const mockToken = 'new-mock-token';

  beforeEach(() => {
    runQuery.mockReset();
    usuarioRepository = new UsuarioRepository();
    jest.clearAllMocks();
    require('../src/config/database').runQuery.mockClear();
    jest.spyOn(jwt, 'sign').mockClear();
  });

  describe('obterUsuarioPorId', () => {
    it('deve retornar um usuário quando o ID existe na base de dados', async () => {
      const mockUsuario = {
        id: 1,
        nome: 'Usuário de Teste',
        email: 'usuario@teste.com',
        cpf: '12345678901',
        tipo: 'cliente',
      };
      require('../src/config/database').runQuery.mockResolvedValue([
        mockUsuario,
      ]);

      const userId = 1;
      const resultado = await usuarioRepository.obterUsuarioPorId(userId);

      expect(resultado).toBeDefined();
      expect(resultado).toBeInstanceOf(Usuario);
      expect(resultado?.id).toEqual(mockUsuario.id);
      expect(resultado?.nome).toEqual(mockUsuario.nome);
      expect(resultado?.email).toEqual(mockUsuario.email);
      expect(resultado?.cpf).toEqual(mockUsuario.cpf);
      expect(resultado?.tipo).toEqual(mockUsuario.tipo);
    });

    it('deve retornar undefined quando o ID não existe na base de dados', async () => {
      require('../src/config/database').runQuery.mockResolvedValue([]);

      const userId = 999;
      const resultado = await usuarioRepository.obterUsuarioPorId(userId);

      expect(resultado).toBeUndefined();
    });

    it('deve lançar um erro em caso de falha na consulta', async () => {
      const errorMessage = 'Erro na consulta SQL';
      require('../src/config/database').runQuery.mockRejectedValue(
        new Error(errorMessage)
      );

      const userId = 1;
      try {
        await usuarioRepository.obterUsuarioPorId(userId);

        fail('A função deveria lançar um erro.');
      } catch (error) {
        expect((error as Error).message).toEqual(errorMessage);
      }
    });
  });
  describe('renovarToken', () => {
    it('deve retornar um novo token quando o usuário é encontrado', async () => {
      const mockUsuario = { id: 1 };
      require('../src/config/database').runQuery.mockResolvedValue([
        mockUsuario,
      ]);
      mockJwtSign.mockImplementation(() => 'new-mock-token');

      const newToken = await usuarioRepository.renovarToken(mockToken);

      expect(newToken).toEqual('new-mock-token');
      expect(mockJwtSign).toHaveBeenCalledWith(
        { id: mockUsuario.id },
        process.env.JWT_SECRET,
        { expiresIn: null }
      );
    });

    it('deve retornar undefined quando nenhum usuário é encontrado', async () => {
      require('../src/config/database').runQuery.mockResolvedValue([]);

      const result = await usuarioRepository.renovarToken(mockToken);

      expect(result).toBeUndefined();
    });

    it('deve lançar um erro em caso de falha na consulta ao banco de dados', async () => {
      const errorMessage = 'Erro na consulta SQL';
      require('../src/config/database').runQuery.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(usuarioRepository.renovarToken(mockToken)).rejects.toThrow(
        errorMessage
      );
    });
  });
  describe('validarToken', () => {
    it('deve retornar true quando um usuário é encontrado com o token fornecido', async () => {
      require('../src/config/database').runQuery.mockResolvedValue([{ id: 1 }]);

      const resultado = await usuarioRepository.validarToken(mockToken);

      expect(resultado).toBe(true);
    });

    it('deve retornar false quando nenhum usuário é encontrado com o token fornecido', async () => {
      require('../src/config/database').runQuery.mockResolvedValue([]);

      const resultado = await usuarioRepository.validarToken(mockToken);

      expect(resultado).toBe(false);
    });
  });
  describe('autenticaAdministrador', () => {
    it('deve lançar um erro quando ocorre um problema na consulta ao banco de dados', async () => {
      const usuarioMock: Usuario = {
        nome: 'Nome do Usuário',
        email: 'email@example.com',
        senha: 'senha123',
        cpf: '123.456.789-00',
      };
      const erroEsperado = new Error('Erro de consulta ao banco de dados');
      runQuery.mockRejectedValue(erroEsperado);

      await expect(
        usuarioRepository.autenticaAdministrador(usuarioMock)
      ).rejects.toThrow(erroEsperado);
    });
    it('deve retornar undefined quando o usuário não é encontrado', async () => {
      const usuarioMock: Usuario = {
        nome: 'Nome do Usuário',
        email: 'email@example.com',
        senha: 'senha123',
        cpf: '123.456.789-50',
      };
      runQuery.mockResolvedValue([{ senha: undefined }]);

      const resultado = await usuarioRepository.autenticaAdministrador(
        usuarioMock
      );

      expect(resultado).toBeUndefined();
    });
    test('deve autenticar um administrador e retornar um token', async () => {
      const usuarioMock: Usuario = {
        nome: 'Nome do Usuário',
        email: 'email@example.com',
        senha: 'senha123',
        cpf: '123.456.789-00',
      };
      require('./../src/config/database').runQuery.mockResolvedValueOnce([
        { id: 1, ...usuarioMock },
      ]);

      const token = await usuarioRepository.autenticaAdministrador(usuarioMock);
      expect(token).toBe('new-mock-token');
    });

    it('deve retornar undefined quando o email não corresponde a nenhum usuário', async () => {
      const mockUsuario = new Usuario('admin@test.com', 'senha123', 'admin');
      require('../src/config/database').runQuery.mockResolvedValueOnce([]);

      const token = await usuarioRepository.autenticaAdministrador(mockUsuario);

      expect(token).toBeUndefined();
    });
  });
  describe('autenticaCliente', () => {
    it('deve retornar um token quando o cliente é autenticado com sucesso', async () => {
      const mockCliUsuario = new Usuario(
        'nome',
        'email@teste.com',
        'senha',
        '12345678901',
        'cliente'
      );
      require('../src/config/database').runQuery.mockResolvedValueOnce([
        mockCliUsuario,
      ]);
      mockJwtSign.mockImplementation(() => 'new-mock-token');

      const token = await usuarioRepository.autenticaCliente(mockCliUsuario);

      expect(token).toEqual(mockToken);
    });

    it('deve retornar undefined quando nenhum cliente é encontrado com o CPF fornecido', async () => {
      require('../src/config/database').runQuery.mockResolvedValueOnce([]);
      const mockCliUsuario = new Usuario(
        'nome',
        'email@teste.com',
        'senha',
        '12345678901',
        'cliente'
      );

      const token = await usuarioRepository.autenticaCliente(mockCliUsuario);

      expect(token).toBeUndefined();
    });

    it('deve lançar um erro em caso de falha na consulta ao banco de dados', async () => {
      const mockCliUsuario = new Usuario(
        'nome',
        'email@teste.com',
        'senha',
        '12345678901',
        'cliente'
      );
      const errorMessage = 'Erro na consulta SQL';
      require('../src/config/database').runQuery.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(
        usuarioRepository.autenticaCliente(mockCliUsuario)
      ).rejects.toThrow(errorMessage);
    });
  });
  describe('salvar', () => {
    it('deve inserir e retornar um usuário quando a inserção é bem-sucedida', async () => {
      const mockUsuario = new Usuario(
        'nome',
        'email@teste.com',
        '12345678901',
        'cliente'
      );
      const mockResponse = [{ ...mockUsuario, id: 1 }];
      require('../src/config/database').runQuery.mockResolvedValue(
        mockResponse
      );

      const resultado = await usuarioRepository.salvar(mockUsuario);

      expect(require('../src/config/database').runQuery).toHaveBeenCalled();
      expect(resultado).toEqual(mockResponse[0]);
    });

    it('deve tratar usuário sem senha corretamente', async () => {
      const mockUsuario = new Usuario(
        'nome',
        'email@teste.com',
        '12345678901',
        'cliente'
      );
      const mockResponse = [{ ...mockUsuario, id: 1 }];
      require('../src/config/database').runQuery.mockResolvedValue(
        mockResponse
      );

      const resultado = await usuarioRepository.salvar(mockUsuario);

      expect(require('../src/config/database').runQuery).toHaveBeenCalledWith(
        expect.anything()
      );
      expect(resultado).toEqual(mockResponse[0]);
    });

    it('deve lançar um erro quando a inserção falha', async () => {
      const mockUsuario = new Usuario(
        'nome',
        'email@teste.com',
        'senha',
        '12345678901',
        'cliente'
      );
      require('../src/config/database').runQuery.mockResolvedValue([]);

      await expect(usuarioRepository.salvar(mockUsuario)).rejects.toThrow(
        'Usuário não encontrado'
      );
    });
  });
});

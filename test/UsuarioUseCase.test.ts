import { UsuarioRepository } from '../src/adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../src/core/domain/models/Usuario';
import { UsuarioUseCase } from '../src/core/domain/useCases/Usuario/UsuarioUseCase';

jest.mock('../src/adapter/driven/infra/UsuarioRepository', () => {
  return {
    UsuarioRepository: jest.fn().mockImplementation(() => {
      return {
        salvar: jest.fn(),
        autenticaAdministrador: jest.fn(),
        autenticaCliente: jest.fn(),
        validarToken: jest.fn(),
      };
    }),
  };
});

type MockResponse = {
  status: jest.Mock;
  send: jest.Mock;
};
describe('UsuarioUseCase - cadastraUsuario', () => {
  let usuarioUseCase: UsuarioUseCase;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepository>;
  let mockRes: MockResponse;

  beforeEach(() => {
    mockUsuarioRepository =
      new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    usuarioUseCase = new UsuarioUseCase(mockUsuarioRepository);
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('cadastraUsuario', () => {
    it('deve cadastrar um usuário com sucesso', async () => {
      const mockUsuario = new Usuario(
        'Nome',
        'email@example.com',
        '123456',
        'cliente'
      );
      mockUsuarioRepository.salvar.mockResolvedValue(mockUsuario);

      await usuarioUseCase.cadastraUsuario(mockUsuario, null);

      expect(mockUsuarioRepository.salvar).toHaveBeenCalledWith(mockUsuario);
    });
    it('deve lançar um erro se a inserção falhar', async () => {
      const mockUsuario = new Usuario(
        'Nome',
        'email@example.com',
        '123456',
        'cliente'
      );
      const errorMessage = 'Erro ao salvar usuário';
      mockUsuarioRepository.salvar.mockRejectedValue(new Error(errorMessage));

      await expect(
        usuarioUseCase.cadastraUsuario(mockUsuario, null)
      ).rejects.toThrow(new Error(errorMessage));
    });
  });

  describe('cadastraAdministrador', () => {
    it('deve cadastrar um administrador com sucesso', async () => {
      const mockUsuario = new Usuario(
        'Admin',
        'admin@example.com',
        'senha123',
        'administrador'
      );
      mockUsuarioRepository.salvar.mockResolvedValue(mockUsuario);

      await usuarioUseCase.cadastraAdministrador(mockUsuario, null);

      expect(mockUsuarioRepository.salvar).toHaveBeenCalledWith(mockUsuario);
    });

    it('deve lançar um erro se a inserção falhar', async () => {
      const mockUsuario = new Usuario(
        'Admin',
        'admin@example.com',
        'senha123',
        'administrador'
      );
      const errorMessage = 'Erro ao salvar administrador';
      mockUsuarioRepository.salvar.mockRejectedValue(new Error(errorMessage));

      await expect(
        usuarioUseCase.cadastraAdministrador(mockUsuario, null)
      ).rejects.toThrow(new Error(errorMessage));
    });
  });

  describe('autenticaAdministrador', () => {
    it('deve autenticar um administrador com sucesso', async () => {
      const mockUsuario = new Usuario(
        'Nome1',
        'email1@example.com',
        '123.456.789-00',
        'admin',
        'senha1',
        'token1',
        1
      );
      mockUsuarioRepository.autenticaAdministrador.mockResolvedValue(
        'token-mock'
      );

      await usuarioUseCase.autenticaAdministrador(mockUsuario, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('token-mock');
    });

    it('deve enviar resposta de erro quando o usuário não for encontrado', async () => {
      const mockUsuario = new Usuario(
        'Nome1',
        'email1@example.com',
        '123.456.789-00',
        'admin',
        'senha1',
        'token1',
        1
      );
      mockUsuarioRepository.autenticaAdministrador.mockResolvedValue(undefined);

      await usuarioUseCase.autenticaAdministrador(mockUsuario, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('Usuário não encontrado');
    });

    it('deve tratar erro durante a autenticação', async () => {
      const mockUsuario = new Usuario(
        'Nome1',
        'email1@example.com',
        '123.456.789-00',
        'admin',
        'senha1',
        'token1',
        1
      );
      const errorMessage = 'Erro na autenticação';
      mockUsuarioRepository.autenticaAdministrador.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        usuarioUseCase.autenticaAdministrador(mockUsuario, mockRes)
      ).rejects.toThrow(new Error(errorMessage));
    });
  });

  describe('autenticaCliente', () => {
    it('deve autenticar um cliente com sucesso', async () => {
      const mockUsuario = new Usuario(
        'Cliente',
        'cliente@example.com',
        'senha123',
        'cliente'
      );
      mockUsuarioRepository.autenticaCliente.mockResolvedValue('token-mock');

      await usuarioUseCase.autenticaCliente(mockUsuario, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('token-mock');
    });

    it('deve enviar resposta de erro quando o cliente não for encontrado', async () => {
      const mockUsuario = new Usuario(
        'Cliente',
        'cliente@example.com',
        'senha123',
        'cliente'
      );
      mockUsuarioRepository.autenticaCliente.mockResolvedValue(undefined);

      await usuarioUseCase.autenticaCliente(mockUsuario, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('Usuário não encontrado');
    });

    it('deve tratar erro durante a autenticação', async () => {
      const mockUsuario = new Usuario(
        'Cliente',
        'cliente@example.com',
        'senha123',
        'cliente'
      );
      const errorMessage = 'Erro na autenticação';
      mockUsuarioRepository.autenticaCliente.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        usuarioUseCase.autenticaCliente(mockUsuario, mockRes)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('validarToken', () => {
    it('deve retornar true para um token válido', async () => {
      const token = 'token-valido';
      mockUsuarioRepository.validarToken.mockResolvedValue(true);

      const resultado = await usuarioUseCase.validarToken(token);

      expect(resultado).toBe(true);
      expect(mockUsuarioRepository.validarToken).toHaveBeenCalledWith(token);
    });

    it('deve retornar false para um token inválido', async () => {
      const token = 'token-invalido';
      mockUsuarioRepository.validarToken.mockResolvedValue(false);

      const resultado = await usuarioUseCase.validarToken(token);

      expect(resultado).toBe(false);
      expect(mockUsuarioRepository.validarToken).toHaveBeenCalledWith(token);
    });

    it('deve tratar erro durante a validação do token', async () => {
      const token = 'token-com-erro';
      const errorMessage = 'Erro na validação do token';
      mockUsuarioRepository.validarToken.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(usuarioUseCase.validarToken(token)).rejects.toThrow(
        errorMessage
      );
    });
  });
});

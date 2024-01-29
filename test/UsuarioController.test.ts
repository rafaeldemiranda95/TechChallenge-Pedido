import { UsuarioRepository } from '../src/adapter/driven/infra/UsuarioRepository';
import { UsuarioController } from '../src/adapter/driver/UsuarioController';
import { Usuario } from '../src/core/domain/models/Usuario';
import { UsuarioUseCase } from '../src/core/domain/useCases/Usuario/UsuarioUseCase';

jest.mock('../src/adapter/driven/infra/UsuarioRepository');
jest.mock('../src/core/domain/useCases/Usuario/UsuarioUseCase');
jest.mock('../src/core/domain/valueObjects/cpf', () => {
  return {
    CPF: jest.fn().mockImplementation(() => ({ value: true })),
  };
});

describe('UsuarioController - cadastrarCliente', () => {
  let usuarioController: UsuarioController;
  let mockUsuarioUseCase: jest.Mocked<UsuarioUseCase>;
  let cpfFactoryMock: jest.Mock;
  let mockRes: any;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    mockUsuarioRepository =
      new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    mockUsuarioUseCase = new UsuarioUseCase(
      mockUsuarioRepository
    ) as jest.Mocked<UsuarioUseCase>;
    cpfFactoryMock = jest.fn();
    usuarioController = new UsuarioController(
      mockUsuarioUseCase,
      cpfFactoryMock
    );
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('cadastrarCliente', () => {
    it('deve lançar erro se CPF não for fornecido', async () => {
      await expect(
        usuarioController.cadastrarCliente('', '', '', mockRes)
      ).rejects.toThrow('CPF é obrigatório');
    });

    it('deve lançar erro se CPF for inválido', async () => {
      cpfFactoryMock.mockReturnValue({ value: false });

      await expect(
        usuarioController.cadastrarCliente(
          'Nome',
          'email@example.com',
          '12345678988',
          mockRes
        )
      ).rejects.toThrow('CPF inválido');

      expect(cpfFactoryMock).toHaveBeenCalledWith('12345678988');
    });

    it('deve cadastrar cliente com sucesso', async () => {
      cpfFactoryMock.mockReturnValue({ value: true });
      const usuarioMock = new Usuario(
        'Nome',
        'email@example.com',
        '031.811.720-73'
      );

      await usuarioController.cadastrarCliente(
        'Nome',
        'email@example.com',
        '031.811.720-73',
        mockRes
      );

      expect(mockUsuarioUseCase.cadastraUsuario).toHaveBeenCalledWith(
        usuarioMock,
        mockRes
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(
        'Usuário cadastrado com sucesso'
      );
    });

    it('deve tratar erro durante o cadastro', async () => {
      cpfFactoryMock.mockReturnValue({ value: true });
      mockUsuarioUseCase.cadastraUsuario.mockRejectedValue(
        new Error('Erro de cadastro')
      );

      await expect(
        usuarioController.cadastrarCliente(
          'Nome',
          'email@example.com',
          '123456',
          mockRes
        )
      ).rejects.toThrow('Erro ao cadastrar usuário');
    });
  });

  describe('cadastrarAdministrador', () => {
    it('deve lançar erro se CPF não for fornecido', async () => {
      await expect(
        usuarioController.cadastrarAdministrador('', '', '', '', mockRes)
      ).rejects.toThrow('CPF é obrigatório');
    });

    it('deve lançar erro se CPF for inválido', async () => {
      cpfFactoryMock.mockReturnValue({ value: false });

      await expect(
        usuarioController.cadastrarAdministrador(
          'Nome',
          'email@example.com',
          '123456',
          'senha',
          mockRes
        )
      ).rejects.toThrow('CPF inválido');
    });

    it('deve cadastrar administrador com sucesso', async () => {
      cpfFactoryMock.mockReturnValue({ value: true });
      const usuarioMock = new Usuario(
        'Nome',
        'email@example.com',
        '123456',
        'administrador',
        'senha'
      );

      await usuarioController.cadastrarAdministrador(
        'Nome',
        'email@example.com',
        '123456',
        'senha',
        mockRes
      );

      expect(mockUsuarioUseCase.cadastraAdministrador).toHaveBeenCalledWith(
        usuarioMock,
        mockRes
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(
        'Usuário cadastrado com sucesso'
      );
    });

    it('deve tratar erro durante o cadastro', async () => {
      cpfFactoryMock.mockReturnValue({ value: true });
      mockUsuarioUseCase.cadastraAdministrador.mockRejectedValue(
        new Error('Erro de cadastro')
      );

      await expect(
        usuarioController.cadastrarAdministrador(
          'Nome',
          'email@example.com',
          '123456',
          'senha',
          mockRes
        )
      ).rejects.toThrow('Erro de cadastro');
    });
  });

  describe('autenticaAdminstrador', () => {
    it('deve autenticar administrador com sucesso', async () => {
      mockUsuarioUseCase.autenticaAdministrador.mockImplementation(
        async (usuario, res) => {
          res.status(200).send('token-valido');
        }
      );

      await usuarioController.autenticaAdminstrador(
        'admin@example.com',
        'senha123',
        mockRes
      );

      expect(mockUsuarioUseCase.autenticaAdministrador).toHaveBeenCalledWith(
        expect.any(Usuario),
        mockRes
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('token-valido');
    });

    it('deve lançar um erro de autenticação do administrador', async () => {
      mockUsuarioUseCase.autenticaAdministrador.mockImplementation(async () => {
        throw new Error('Erro de autenticação do administrador');
      });

      await expect(
        usuarioController.autenticaAdminstrador(
          'admin@example.com',
          'senha123',
          mockRes
        )
      ).rejects.toThrow('Erro de autenticação do administrador');
    });
  });

  describe('autenticaCliente', () => {
    it('deve autenticar um cliente com sucesso', async () => {
      mockUsuarioUseCase.autenticaCliente.mockImplementation(
        async (usuario, res) => {
          res.status(200).send('token-valido');
        }
      );

      await usuarioController.autenticaCliente('149.292.720-17', mockRes);

      expect(mockUsuarioUseCase.autenticaCliente).toHaveBeenCalledWith(
        expect.any(Usuario),
        mockRes
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('token-valido');
    });

    it('deve lançar um erro se a autenticação do cliente falhar', async () => {
      mockUsuarioUseCase.autenticaCliente.mockRejectedValue(
        new Error('Erro de autenticação do cliente')
      );

      await expect(
        usuarioController.autenticaCliente('123456', mockRes)
      ).rejects.toThrow('Erro de autenticação do cliente');
    });
  });
});

import { UsuarioRepository } from '../../../../adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../../models/Usuario';
import { UsuarioUseCase } from './UsuarioUseCase';

// Continua com o mocking da classe UsuarioRepository
jest.mock('../../../../adapter/driven/infra/UsuarioRepository', () => {
  return {
    UsuarioRepository: jest.fn().mockImplementation(() => {
      return {
        salvar: jest.fn(),
      };
    }),
  };
});

describe('UsuarioUseCase - cadastraUsuario', () => {
  let usuarioUseCase: UsuarioUseCase;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    // Instancia o mock de UsuarioRepository
    mockUsuarioRepository =
      new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    usuarioUseCase = new UsuarioUseCase(mockUsuarioRepository);
    jest.clearAllMocks();
  });

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
});

import { Request, Response } from 'express';
import { autenticacaoMiddleware } from '../src/adapter/middleware/autenticacao.middleware';
import { UsuarioUseCase } from '../src/core/domain/useCases/Usuario/UsuarioUseCase';

describe('autenticacaoMiddleware', () => {
  const mockUsuarioUseCase = {
    validarToken: jest.fn(),
  };
  const mockReq = {
    headers: {
      authorization: 'token-invalido',
    },
  } as unknown as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    mockReq.headers.authorization = '';
    const middleware = autenticacaoMiddleware(
      mockUsuarioUseCase as unknown as UsuarioUseCase
    );

    await middleware(
      mockReq as unknown as Request,
      mockRes as unknown as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Token de autenticação não fornecido.',
    });
  });

  it('deve retornar 401 se o token for inválido', async () => {
    mockReq.headers.authorization = 'token-invalido';
    mockUsuarioUseCase.validarToken.mockResolvedValue(false);
    const middleware = autenticacaoMiddleware(
      mockUsuarioUseCase as unknown as UsuarioUseCase
    );

    await middleware(
      mockReq as unknown as Request,
      mockRes as unknown as Response,
      mockNext
    );

    expect(mockUsuarioUseCase.validarToken).toHaveBeenCalledWith(
      'token-invalido'
    );
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token inválido.' });
  });

  it('deve chamar next se o token for válido', async () => {
    mockReq.headers.authorization = 'token-valido';
    mockUsuarioUseCase.validarToken.mockResolvedValue(true);
    const middleware = autenticacaoMiddleware(
      mockUsuarioUseCase as unknown as UsuarioUseCase
    );

    await middleware(
      mockReq as unknown as Request,
      mockRes as unknown as Response,
      mockNext
    );

    expect(mockUsuarioUseCase.validarToken).toHaveBeenCalledWith(
      'token-valido'
    );
    expect(mockNext).toHaveBeenCalled();
  });
});

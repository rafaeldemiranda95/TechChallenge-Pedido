import { UsuarioUseCase } from '../../core/domain/useCases/Usuario/UsuarioUseCase';
import { Request, Response, NextFunction } from 'express';

export function autenticacaoMiddleware(usuarioUseCase: UsuarioUseCase) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Token de autenticação não fornecido.' });
    }

    const estaAutenticado = await usuarioUseCase.validarToken(token);

    if (!estaAutenticado) {
      return res.status(401).json({ error: 'Token inválido.' });
    } else {
      next();
    }
  };
}

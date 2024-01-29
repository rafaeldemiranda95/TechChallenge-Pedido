import { NextFunction, Request, Response } from 'express';
import { UsuarioService } from '../../core/applications/services/UsuarioService';
export function verificaTipoUsuario(usuarioService: UsuarioService) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Token de autenticação não fornecido.' });
    }
    const estaAutenticado = await usuarioService.verificaTipoUsuario(token);

    next();
  };
}

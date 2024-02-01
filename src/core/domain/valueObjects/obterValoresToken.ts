import { UsuarioRepository } from '../../../adapter/driven/infra/UsuarioRepository';
import { Usuario } from '../models/Usuario';
const jwt = require('jsonwebtoken');

export class ObterValoresToken {
  public async obterInformacoesToken(
    token: string
  ): Promise<Usuario | undefined> {
    let informacoes = jwt.verify(token, process.env.JWT_SECRET);
    if (informacoes) {
      let usuarioRepository = new UsuarioRepository();

      let usuario = await usuarioRepository.obterUsuarioPorId(informacoes.id);

      return usuario;
    } else {
      throw new Error('Token inválido');
    }
  }
}
